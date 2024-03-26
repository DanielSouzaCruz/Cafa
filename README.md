# Cafa
Conversor de arquivos .pfx e .ley+.crt

Comandos OPENSSL
(openssl já vem instalado em máquinas com GIT. Pressione WIN + R e digite %ProgramFiles% e vá na pasta Git/usr/bin

Gerar CRT e KEY válidos para testes (lembre-se de alterar os endereços para serem válidos): 
openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes -keyout C:\Users\Laboratorio\Downloads\example.com.key -out C:\Users\Laboratorio\Downloads\example.com.crt -subj "/CN=example.com" -addext "subjectAltName=DNS:example.com,DNS:*.example.com,IP:10.0.0.1"

Gerar PFX a partir de CRT e KEY (lembre-se de informar qualquer senha quando solicitado): 
openssl pkcs12 -export -out C:\Users\Laboratorio\Downloads\star_dot_robertwray_dot_local.pfx -inkey C:\Users\Laboratorio\Downloads\example.com.key -in C:\Users\Laboratorio\Downloads\example.com.crt
