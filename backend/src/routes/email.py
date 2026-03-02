from flask import Blueprint, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime

email_bp = Blueprint('email', __name__)

@email_bp.route('/api/send-email', methods=['POST'])
def send_email():
    try:
        data = request.get_json()
        
        # Validação dos dados
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'Campo {field} é obrigatório'}), 400
        
        name = data['name']
        email = data['email']
        subject = data['subject']
        message = data['message']
        
        # Configuração do e-mail
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = "studiosleovox@gmail.com"  # E-mail do remetente
        sender_password = os.getenv('EMAIL_PASSWORD', '')  # Senha do app Gmail
        recipient_email = "studiosleovox@gmail.com"  # E-mail de destino
        
        # Criação da mensagem
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = f"[PORTFÓLIO] {subject}"
        
        # Corpo do e-mail
        email_body = f"""
Nova mensagem recebida através do portfólio:

Nome: {name}
E-mail: {email}
Assunto: {subject}
Data: {datetime.now().strftime('%d/%m/%Y às %H:%M')}

Mensagem:
{message}

---
Esta mensagem foi enviada através do formulário de contato do portfólio Leovox Studios.
        """
        
        msg.attach(MIMEText(email_body, 'plain', 'utf-8'))
        
        # Envio do e-mail
        if sender_password:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, sender_password)
            text = msg.as_string()
            server.sendmail(sender_email, recipient_email, text)
            server.quit()
            
            return jsonify({'success': True, 'message': 'E-mail enviado com sucesso!'})
        else:
            # Para desenvolvimento/teste - apenas simula o envio
            print(f"[SIMULAÇÃO] E-mail enviado para {recipient_email}")
            print(f"Assunto: {subject}")
            print(f"De: {name} ({email})")
            print(f"Mensagem: {message}")
            
            return jsonify({'success': True, 'message': 'Mensagem recebida com sucesso! (modo desenvolvimento)'})
            
    except Exception as e:
        print(f"Erro ao enviar e-mail: {str(e)}")
        return jsonify({'success': False, 'error': 'Erro interno do servidor'}), 500

