# Cafa
Conversor de arquivos .pfx e .key + .crt


## Testes OPENSSL

O openssl já vem instalado em máquinas Windows com GIT. Para acessa-lo, pressione WIN + R e digite %ProgramFiles% e vá na pasta Git/usr/bin. Então abra o prompt de comando com o path do caminho da pasta encontrada.
### Comandos OPENSSL
- **Gerar CRT e KEY válidos para testes (lembre-se de alterar os endereços para serem válidos):**
```
openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes -keyout C:\Users\Laboratorio\Downloads\example.com.key -out C:\Users\Laboratorio\Downloads\example.com.crt -subj "/CN=example.com" -addext "subjectAltName=DNS:example.com,DNS:*.example.com,IP:10.0.0.1"
```

- **Converter CRT e KEY para PFX (lembre-se de informar uma senha qualquer quando solicitado):** 
```
openssl pkcs12 -export -out C:\Users\Laboratorio\Downloads\star_dot_robertwray_dot_local.pfx -inkey C:\Users\Laboratorio\Downloads\example.com.key -in C:\Users\Laboratorio\Downloads\example.com.crt
```

- **Converter PFX para CRT e KEY (lembre-se de informar a senha atribuída ao arquivo PFX quando solicitado):**
```
openssl pkcs12 -in C:\Users\Laboratorio\Downloads\star_dot_robertwray_dot_local.pfx -out C:\Users\Laboratorio\Downloads\otherCrt.crt -clcerts -nokeys && openssl pkcs12 -in C:\Users\Laboratorio\Downloads\star_dot_robertwray_dot_local.pfx -out C:\Users\Laboratorio\Downloads\otherKey.key -nocerts -nodes
```
