window.addEventListener('load', function (){
  document.getElementById('pfx_file').click()
});

var forge = require('node-forge');

function converterCrtAndKeyToPfx() {
  const elementInputCrt = document.getElementById('crtFile').files[0];
  const elementInputKey = document.getElementById('keyFile').files[0];

  var conteudoArquivoCrt, conteudoArquivoKey;
  
  if (elementInputCrt) {
    var reader = new FileReader();
    reader.readAsText(elementInputCrt, "UTF-8");
    reader.onload = function (evt) {
      conteudoArquivoCrt = evt.target.result;

      if (elementInputKey) {
        var reader = new FileReader();
        reader.readAsText(elementInputKey, "UTF-8");
        reader.onload = function (evt) {

          conteudoArquivoKey = evt.target.result;
          // alert("Conteúdo do arquivo " + elementInputCrt.path + ": \n" + conteudoArquivoCrt);
          // alert("Conteúdo do arquivo " + elementInputKey.path + ": \n" + conteudoArquivoKey);

          const senhaPfx = document.getElementById("senhaParaPFX").value;
          let nomePfx = document.getElementById("nomeParaPFX").value;

          try {
            // Converter o conteúdo para o formato Forge
            const certAsn1 = forge.pki.certificateFromPem(conteudoArquivoCrt);
            const chaveAsn1 = forge.pki.privateKeyFromPem(conteudoArquivoKey);

            // Criar o objeto PKCS#12 (PFX)
            const p12Asn1 = forge.pkcs12.toPkcs12Asn1(chaveAsn1, certAsn1, senhaPfx);

            // Converter o objeto PKCS#12 para um ArrayBuffer
            const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
            const p12b64 = forge.util.encode64(p12Der);

            if (nomePfx == "") {
              nomePfx = "certificate";
            }
            const a = document.createElement('a');
            a.download = `${nomePfx}.pfx`;
            a.setAttribute('href', 'data:application/x-pkcs12;base64,' + p12b64);
            a.appendChild(document.createTextNode('Download'));
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
          } catch (exception) {
            notification("Erro na conversão. Verifique os arquivos enviados e tente novamente");
          }

          // Salvar arquivo PFX
          // fs.writeFileSync("C:\\", p12Der, { encoding: 'binary' });

          /*const blob = new Blob([p12Der], { type: 'application/x-pkcs12' });
          // Criar um link de download
          const linkDownload = document.createElement("a");
          linkDownload.href = URL.createObjectURL(blob);
          linkDownload.download = "certificate.pfx";

          // Ocultar o link de download e clicá-lo programaticamente
          linkDownload.style.display = "none";
          document.body.appendChild(linkDownload);
          linkDownload.click();

          // Remover o link de download depois que o download é concluído
          document.body.removeChild(linkDownload);*/

        }
        reader.onerror = function (evt) {
          notification("Arquivo corrompido ou com erro! Porfavor tente um arquivo válido")
        }
      }
    }
    reader.onerror = function (evt) {
      notification("Arquivo corrompido ou com erro! Porfavor tente um arquivo válido")
    }
  }
}

function arrayBufferToString(arrayBuffer) {
  return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
}

function converterPfxToCrtAndKey() {
  const elementInputPfx = document.getElementById('pfxFile').files[0];

  if (elementInputPfx) {

    var reader = new FileReader();
    reader.readAsArrayBuffer(elementInputPfx);
    reader.onload = function (event) {
      const pfxContent = new Uint8Array(event.target.result);
      let pfxName = elementInputPfx.name;
      pfxName = pfxName.split('.')[0];

      const senhaPfx = document.getElementById("senhaParaPFX").value;


      try {

        // Decodificando o conteúdo do arquivo PFX
        const p12Buffer = forge.util.createBuffer(arrayBufferToString(pfxContent));
        const p12Asn1 = forge.asn1.fromDer(p12Buffer.getBytes());
        const p12Parsed = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, senhaPfx);

        // Obtendo a chave privada e o certificado
        const key = p12Parsed.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag][0];
        const cert = p12Parsed.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag][0];

        // Convertendo a chave privada e o certificado para formato PEM
        const privateKeyPem = forge.pki.privateKeyToPem(key.key);
        const certPem = forge.pki.certificateToPem(cert.cert);

        // Exibindo a chave privada e o certificado no console
        /* console.log("Chave privada (KEY):");
         console.log(privateKeyPem);
 
         console.log("\nCertificado (CRT):");
         console.log(certPem);*/

        // Baixando os arquivos CRT e KEY
        downloadFile(privateKeyPem, `${pfxName}.key`, 'application/octet-stream');
        downloadFile(certPem, `${pfxName}.crt`, 'application/octet-stream');

      } catch (error) {
        notification("Senha ou arquivo inválido! Tente novamente com uma senha válida e selecionando um arquivo válido.")
      }

    }
  }
}

function downloadFile(data, filename, type) {
  const blob = new Blob([data], { type: type });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

