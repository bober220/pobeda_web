from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Разрешаем запросы с любого origin (для разработки)

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')

@app.route('/api/send-to-telegram', methods=['POST'])
def send_to_telegram():
    try:
        # Получаем данные из запроса
        data = request.get_json()

        # Проверяем наличие обязательных полей
        if not data or 'name' not in data or 'phone' not in data:
            return jsonify({
                'success': False,
                'error': 'Требуются имя и телефон'
            }), 400

        # Проверяем, что поля не пустые
        if not data['name'].strip() or not data['phone'].strip():
            return jsonify({
                'success': False,
                'error': 'Имя и телефон не могут быть пустыми'
            }), 400

        # Формируем сообщение для Telegram
        message = (
            "📌 Новая заявка:\n\n"
            f"👤 Имя: {data['name']}\n"
            f"📞 Телефон: {data['phone']}\n"
            f"❓ Вопрос: {data.get('question', 'Не указан')}"
        )

        # Отправляем в Telegram
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        response = requests.post(url, json={
            'chat_id': TELEGRAM_CHAT_ID,
            'text': message,
            'parse_mode': 'HTML'
        })
        response.raise_for_status()

        return jsonify({'success': True})

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Ошибка сервера: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)