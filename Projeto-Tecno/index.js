const { app, BrowserWindow } = require('electron')
const fs = require('fs');
var forge = require('node-forge');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

function escolherPfx(event) {
  document.querySelector(".main").style.display = "none";
  document.getElementById("file").click();

  if (event.target.files && event.target.files[0]) {
    const arquivo = event.target.files[0];

    if (arquivo) {
      const nome = arquivo.name.substring(0, 25);
      document.getElementById("nomeArquivo").textContent = nome;
      document.getElementById("file").classList.add("hidden");
      document.querySelector(".container").style.display = "flex";
      document.getElementsByClassName("password-name")[0].style.display = "block";
      document.getElementById("senhaParaPFX").value = "";
    }
  }
}

function fecharArquivo() {
  document.querySelector(".main").style.display = "grid";
  document.querySelector(".container").style.display = "none";
  document.getElementById("file").value = "";
}

function fecharArquivoKey_Crt(event) {

  // Após término do projeto, remover mensagens de Debug (console.log) da função

  const nomeCompletoArquivo = event.target.parentElement.querySelector('#nomeArquivo').dataset.nomecompletoarquivo;

  console.log("Nome do arquivo completo que será removido: " + nomeCompletoArquivo);

  // Criar um 'armazenador' temporário para armazenar os Arquivos que DEVEM continuar no FileList
  const dt = new DataTransfer();

  const input = document.getElementById('file');
  const { files } = input; // o FileList

  // iterar sobre todos os arquivos do FileList para adicionar ao 'armazenador' temporário os arquivos que não devem ser removidos do FileList
  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    if (nomeCompletoArquivo !== files[i].name) { // adiciona á lista temporária dos arquivos que NÃO serão removidos da seleção
      dt.items.add(file)
    } else { // caso seja necessário remover o arquivo da seleção, executa os procedimentos de formatação da interface gráfica

      if (document.getElementById('crtFile').files.length != 0 && nomeCompletoArquivo == document.getElementById('crtFile').files[0].name) { // caso o input oculto de arquivo CRT esteja com algum arquivo e o nome deste arquivo seja o mesmo que o nome completo do arquivo á ser removido, ...
        document.getElementById('crtFile').value = ""; // remove o arquivo do input oculto para arquivos crt
        document.getElementById("msgForUser").innerText = "Agora selecione o arquivo CRT";  // atualiza a mensagem para comunicar o usuário o que ele deve fazer
        document.getElementById("file").accept = ".crt"; // define o filtro de arquivos do input para que o usuário possa selecionar arquivos com a extensão crt
      } else if (document.getElementById('keyFile').files.length != 0 && nomeCompletoArquivo == document.getElementById('keyFile').files[0].name) {
        document.getElementById('keyFile').value = "";
        document.getElementById("msgForUser").innerText = "Agora selecione o arquivo KEY";
        document.getElementById("file").accept = ".key";
      }

      if (document.getElementById('keyFile').files.length == 0 && document.getElementById('crtFile').files.length == 0) { // Caso os dois inputs ocultos (crt e key) estejam vazios, atualiza a mensagem para comunicar o usuário o que ele deve fazer e define o filtro de arquivos do input para que o usuário possa selecionar arquivos com a extensão crt ou key
        document.getElementById("msgForUser").innerText = "Selecione um arquivo de cada vez (.crt ou .key)";
        document.getElementById("file").accept = ".crt,.key";
        document.querySelector(".main").style.height = "46vh"; 
      }
    }

  }

  // condicionais para controlar se o botão downlaod deve ou não aparecer E também se a seção seleção de arquivos deve ou não aparecer
  if (document.getElementById("crtFile").files.length == 1 && document.getElementById("keyFile").files.length == 1) {
    document.getElementsByClassName("download-button")[0].style.display = "inline-block";
    document.getElementsByClassName("password-name")[0].style.display = "block";
    document.querySelector(".main").style.display = "none";
  } else {
    document.getElementsByClassName("download-button")[0].style.display = "none";
    document.getElementsByClassName("password-name")[0].style.display = "none";
    document.getElementById("senhaParaPFX").value = "";
    document.getElementById("nomeParaPFX").value = "";
    document.querySelector(".main").style.display = "grid";
  }

  input.files = dt.files; // Atualiza o FileList com os arquivos que NÃO serão removidos

  event.target.parentElement.remove(); // remove da interface gráfica o div que mostra o arquivo e o botão de remover

  if (document.getElementById("containerArquivos").childElementCount == 0) { // caso o div que é 'pai' dos divs que mostram o arquivo não tenha mais nenhum arquivo, mostra novamente o selecionador de arquivos
    document.querySelector(".main").style.display = "grid"; // mostra o selecionador de arquivos
    document.querySelector(".container").style.display = "none";  // esconde  o visualizador de arquivos selecionados
  }

}

function escolherKey_Crt(event) {

  if (event.target.files && event.target.files[0]) {
    document.getElementById("containerArquivos").innerHTML = ""; // remove qualquer elemento filho do div que mostra os arquivos selecionados
    //document.querySelector(".main").style.display = "none"; // esconde o selecionador de arquivos
    document.querySelector(".container").style.display = "flex"; // mostra o visualizador de arquivos selecionados


    if (document.getElementById("crtFile").files.length == 1 && document.getElementById("keyFile").files.length == 1) { // caso os dois arquivos crt e key estejam já selecionados, alerta ao usuário que não pode mais selecionar nenhum arquivo a mais
      alert("Não é permitido selecionar mais que dois arquivos");
      event.preventDefault();
    } else {

      if (event.target.files[0].name.split('.').pop() == "crt") { // obtém a extensão do arquivo selecionado pelo usuário
        document.getElementById("crtFile").files = event.target.files; // passa o arquivo selecionado para o input oculto de files crt
        document.getElementById("msgForUser").innerText = "Agora selecione o arquivo KEY";
        document.querySelector(".main").style.height = "26vh"; 
        document.getElementById("file").accept = ".key"; // define o filtro de seleção de arquivos key
      } else {
        document.getElementById("keyFile").files = event.target.files; // passa o arquivo selecionado para o input oculto de files key
        document.getElementById("msgForUser").innerText = "Agora selecione o arquivo CRT";
        document.querySelector(".main").style.height = "26vh"; 
        document.getElementById("file").accept = ".crt"; // define o filtro de seleção de arquivos crt
      }
    }

    const dt = new DataTransfer(); // armazenador temporário para passar os arquivos dos inputs ocultos para o input de seleção de arquivos pelo usuário

    if (document.getElementById('crtFile').files.length != 0)
      dt.items.add(document.getElementById('crtFile').files[0]); // passa os arquivos do input oculto de arquivos crt para o armazenador temporário

    if (document.getElementById('keyFile').files.length != 0)
      dt.items.add(document.getElementById('keyFile').files[0]); // passa os arquivos do input oculto de arquivos key para o armazenador temporário

    // condicionais para controlar se o botão downlaod deve ou não aparecer E também se a seção seleção de arquivos deve ou não aparecer
    if (document.getElementById("crtFile").files.length == 1 && document.getElementById("keyFile").files.length == 1) { // 
      document.getElementsByClassName("download-button")[0].style.display = "inline-block";
      document.querySelector(".main").style.display = "none";
      document.getElementsByClassName("password-name")[0].style.display = "block";
    } else {
      document.getElementsByClassName("download-button")[0].style.display = "none";
      document.querySelector(".main").style.display = "grid";
      document.getElementsByClassName("password-name")[0].style.display = "none";
      document.getElementById("senhaParaPFX").value = "";
      document.getElementById("nomeParaPFX").value = "";
    }

    document.getElementById('file').files = dt.files; // Atualiza o FileList com os arquivos do armazenador temporário

    // itera sobre todos os arquivos do input que contém os arquivos selecionados
    for (let index = 0; index < event.target.files.length; index++) {
      let arquivo = {};

      arquivo.name = event.target.files[index].name;

      let nomeAExibir = arquivo.name.length > 25 ? arquivo.name.substring(0, 25) + "..." : arquivo.name;


      document.getElementById("containerArquivos").innerHTML += `
  <div class="grid_inputs">
    <img src="images/file-text.png" alt="arquivo" class="arquive">
    <p class="file-name" id="nomeArquivo" data-nomeCompletoArquivo="${arquivo.name}">${nomeAExibir}</p>
    <img src="images/x.png" alt="close" class="close" onclick="fecharArquivoKey_Crt(event)">  
  </div>
  `;
    }
  }
}

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
          const nomePfx = document.getElementById("nomeParaPFX").value;

          // Converter o conteúdo para o formato Forge
          const certAsn1 = forge.pki.certificateFromPem(conteudoArquivoCrt);
          const chaveAsn1 = forge.pki.privateKeyFromPem(conteudoArquivoKey);

          // Criar o objeto PKCS#12 (PFX)
          const p12Asn1 = forge.pkcs12.toPkcs12Asn1(chaveAsn1, certAsn1, senhaPfx);

          // Converter o objeto PKCS#12 para um ArrayBuffer
          const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
          const p12b64 = forge.util.encode64(p12Der);

          const a = document.createElement('a');
          a.download = `${nomePfx}.p12`;
          a.setAttribute('href', 'data:application/x-pkcs12;base64,' + p12b64);
          a.appendChild(document.createTextNode('Download'));
          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
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
          console.log("Erro");
        }
      }
    }
    reader.onerror = function (evt) {
      console.log("Erro");
    }
  }


}

function converterPfxToCrtAndKey() {
  const elementInputPfx = document.getElementById('file').files[0];

  if (elementInputPfx) {
    var reader = new FileReader();
    reader.readAsText(elementInputPfx, "UTF-8");
    reader.onload = function (evt) {
      var conteudoArquivoPfx = evt.target.result;
      var senhaPfx = document.getElementById("senhaParaPFX").value;
      alert(senhaPfx);
    }
  }
}