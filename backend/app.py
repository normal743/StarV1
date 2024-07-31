from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import json
import os
import sys
from io import StringIO
import tiktoken

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # 明确指定允许的源


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

INPUT_TOKEN_PRICE = 0.15
OUTPUT_TOKEN_PRICE = 0.60

def count_tokens(text):
    encoding = tiktoken.encoding_for_model("gpt-4")
    return len(encoding.encode(text))

def calculate_cost(input_tokens, output_tokens):
    input_cost = (input_tokens / 1_000_000) * INPUT_TOKEN_PRICE
    output_cost = (output_tokens / 1_000_000) * OUTPUT_TOKEN_PRICE
    total_cost = input_cost + output_cost
    return input_cost, output_cost, total_cost

def execute_python(code):
    try:
        original_stdout = sys.stdout
        sys.stdout = StringIO()
        
        locals_dict = {}
        exec(code, globals(), locals_dict)
        last_value = None
        if len(locals_dict) > 0:
            last_value = locals_dict[list(locals_dict.keys())[-1]]
        
        output = sys.stdout.getvalue()
        sys.stdout = original_stdout
        
        if output.strip():
            return output.strip()
        elif last_value is not None:
            return str(last_value)
        else:
            return ""
    except Exception as e:
        return str(e)

@app.route('/chat', methods=['POST', 'OPTIONS'])  # 添加 OPTIONS 方法支持
def chat():
    if request.method == 'OPTIONS':
        # 预检请求处理
        response = app.make_default_options_response()
    else:
        # 实际的 POST 请求处理
        data = request.json
        conversation = data.get('conversation', [])
        mode = data.get('mode', '1')

        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": m["role"], "content": m["content"]} for m in conversation]
            )
            ai_response_raw = response.choices[0].message.content
            ai_response = json.loads(ai_response_raw)
            
            status = ai_response.get("status")
            message = ai_response.get("message")
            
            debug_info = {
                "status": status,
                "original_message": message
            }
            
            if status == "python":
                result = execute_python(message)
                debug_info["python_result"] = result
                conversation.append({"role": "user", "content": json.dumps({"role": "python", "message": result, "hint": "Is this the result from python, treat math result as truth and careful for search result"})})
            else:
                conversation.append({"role": "assistant", "content": ai_response_raw})
            
            total_tokens = sum(count_tokens(m["content"]) for m in conversation)
            _, _, total_cost = calculate_cost(total_tokens, total_tokens)  # Approximation
            
            return jsonify({
                "response": ai_response,
                "conversation": conversation,
                "total_tokens": total_tokens,
                "total_cost": total_cost,
                "debug_info": debug_info if mode == "2" else None
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    return response

if __name__ == '__main__':
    app.run(debug=True)
