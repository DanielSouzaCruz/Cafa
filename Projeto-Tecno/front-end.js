const { app, BrowserWindow } = require('electron')
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    minWidth: 800,
    minHeight: 720,
  })

  win.loadFile("front_end_html/index.html")
}

app.whenReady().then(() => {
  createWindow()
})

var dialogInputSelectionFileEstaAberto;

function escolherKey_Crt(event) {
  dialogInputSelectionFileEstaAberto = false;
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
        document.querySelector(".main").style.height = "20vh";
        document.getElementById("file").accept = ".key"; // define o filtro de seleção de arquivos key
      } else {
        document.getElementById("keyFile").files = event.target.files; // passa o arquivo selecionado para o input oculto de files key
        document.getElementById("msgForUser").innerText = "Agora selecione o arquivo CRT";
        document.querySelector(".main").style.height = "20vh";
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
      document.getElementsByClassName("download-button-files")[0].style.display = "inline-block";
      document.querySelector(".main").style.display = "none";
      document.getElementsByClassName("password-name")[0].style.display = "block";
      document.querySelector(".selection").style.border = '1px dashed #330253'
    } else {
      document.getElementsByClassName("download-button-files")[0].style.display = "none";
      document.querySelector(".main").style.display = "grid";
      document.getElementsByClassName("password-name")[0].style.display = "none";
      document.getElementById("senhaParaPFX").value = "";
      document.getElementById("nomeParaPFX").value = "";
      document.querySelector(".selection").style.border = 'none'
    }

    document.getElementById('file').files = dt.files; // Atualiza o FileList com os arquivos do armazenador temporário

    // itera sobre todos os arquivos do input que contém os arquivos selecionados
    for (let index = 0; index < event.target.files.length; index++) {
      let arquivo = {};

      arquivo.name = event.target.files[index].name;

      let nomeAExibir = arquivo.name.length > 25 ? arquivo.name.substring(0, 25) + "..." : arquivo.name;


      document.getElementById("containerArquivos").innerHTML += `
  <div class="grid_inputs">
    <img src="../images/file-image.png" alt="arquivo" class="arquive"  style="width: 40px;">
    <p class="file-name" id="nomeArquivo" data-nomeCompletoArquivo="${arquivo.name}">${nomeAExibir}</p>
    <img src="../images/x.png" alt="close" class="close" onclick="fecharArquivoKey_Crt(event)">  
  </div>
  `;
    }
  }
}

function escolherPfx(event) {
  event.preventDefault();

  document.querySelector(".main").style.display = "none";
  document.getElementById("file").click();

  if (event.target.files && event.target.files[0]) {
    const arquivo = event.target.files[0];

    if (arquivo) {

      const dt = new DataTransfer();
      dt.items.add(arquivo);
      document.getElementById('pfxFile').files = dt.files;

      const nome = arquivo.name.length > 25 ? arquivo.name.substring(0, 25) + "..." : arquivo.name;

      document.getElementById("nomeArquivo").innerText = nome;

      document.getElementById("file").classList.add("hidden");
      document.querySelector(".container").style.display = "flex";
      document.querySelector(".selection").style.border = "1px dashed #330253";
      document.getElementById("senhaParaPFX").value = "";
    }
  }
}

function fecharArquivo() {
  document.querySelector(".main").style.display = "grid";
  document.querySelector(".container").style.display = "none";
  document.getElementById("file").value = "";
  document.querySelector('.selection').style.border = "none";
}

function fecharArquivoKey_Crt(event) {

  // Após término do projeto, remover mensagens de Debug (console.log) da função

  const nomeCompletoArquivo = event.target.parentElement.querySelector('#nomeArquivo').dataset.nomecompletoarquivo;

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
    document.getElementsByClassName("download-button-files")[0].style.display = "inline-block";
    document.getElementsByClassName("password-name")[0].style.display = "block";
    document.querySelector(".main").style.display = "none";
    document.querySelector(".selection").style.border = '1px dashed #330253';
  } else {
    document.getElementsByClassName("download-button-files")[0].style.display = "none";
    document.getElementsByClassName("password-name")[0].style.display = "none";
    document.getElementById("senhaParaPFX").value = "";
    document.getElementById("nomeParaPFX").value = "";
    document.querySelector(".main").style.display = "grid";
    document.querySelector(".selection").style.border = 'none';
  }

  input.files = dt.files; // Atualiza o FileList com os arquivos que NÃO serão removidos

  event.target.parentElement.remove(); // remove da interface gráfica o div que mostra o arquivo e o botão de remover

  if (document.getElementById("containerArquivos").childElementCount == 0) { // caso o div que é 'pai' dos divs que mostram o arquivo não tenha mais nenhum arquivo, mostra novamente o selecionador de arquivos
    document.querySelector(".main").style.display = "grid"; // mostra o selecionador de arquivos
    document.querySelector(".container").style.display = "none";  // esconde  o visualizador de arquivos selecionados
  }

}

function select_converter(element) {
  const itensLista = document.querySelectorAll(".segment ul li");
  itensLista.forEach(item => item.classList.remove("active"));
  element.classList.add("active");
  const divSelection = document.querySelector('.selection');

  if (element.classList.contains("active") && element.id === "pfx_file") {
    divSelection.innerHTML = '';
    document.getElementsByClassName('selection')[0].setAttribute("data-modo-atual-conversao", "PFX");
    const pfx_file = `
    <main class="main">
     <input type="file" id="pfxFile" style="display:none">
      <input onchange="escolherPfx(event)" type="file" id="file" accept=".pfx,.p12">
      <label class="botaoSelecionarFiles" for="file" id="file"">
        <img src="../images/upload.png" alt="upload de arquivo" style="width: 30px;">Selecione o arquivo
      </label>
      <p id="msgForUser">Selecione um arquivo (.pfx)</p>
    </main>

    <div class="container" style="display: none;">
    <div class="grid">
      <img src="../images/file-image.png" alt="arquivo" class="arquive" style="width: 40px;">
      <p class="file-name" id="nomeArquivo"></p>
      <img src="../images/x.png" alt="close" class="close" onclick="fecharArquivo()">
    </div>
    <div class="password-name">
      <div class="row">
        <input type="text" id="senhaParaPFX" placeholder="Senha para Verificar Certificado" autocomplete="off"
          style="width: 300px">
      </div>
    </div>
    <button class="download-button" onclick="converterPfxToCrtAndKey()">Download</button>
  </div>
  `;
    divSelection.innerHTML = pfx_file;
  } else {
    divSelection.innerHTML = '';
    document.getElementsByClassName('selection')[0].setAttribute("data-modo-atual-conversao", "CRT_KEY");
    const key_crt_file = `
    <div class="container" style="display: none;">
    <div id="containerArquivos">
      <div class="grid_inputs">
        <img src="../images/file-image.png" alt="arquivo" class="arquive">
        <p class="file-name" id="nomeArquivo"></p>
        <img src="images/x.png" alt="close" class="close" onclick="fecharArquivoKey_Crt()">
      </div>
    </div>
    <div class="password-name">
      <div class="row">
        <input type="text" id="nomeParaPFX" placeholder="Nome para Certificado"  autocomplete="off">
        <input type="text" id="senhaParaPFX" placeholder="Senha para Converter"  autocomplete="off">
      </div>
    </div>
    <button class="download-button-files" onclick="converterCrtAndKeyToPfx()">Download</button>
  </div>

  <main class="main">
    <input onchange="escolherKey_Crt(event)" type="file" id="file" accept=".crt,.key">
    <input type="file" id="crtFile" style="display:none">
    <input type="file" id="keyFile" style="display:none">
    <label class="botaoSelecionarFiles" for="file">
      <img src="../images/upload.png" alt="upload de arquivo" style="width: 30px;">Selecione os arquivos
    </label>
    <p id="msgForUser">Selecione um arquivo de cada vez (.crt ou .key)</p>
  </main>
    `
    divSelection.innerHTML = key_crt_file;
  }
}

function notification(e) {
  const audio = new Audio('../audio/Error.mp3')
  audio.play();
  Toastify({
    text: e,
    duration: 5000,
    className: "info",
    gravity: 'bottom',
    style: {
      background: "#ffffff",
      color: "#000000",
      border: "2px solid #622F7A"
    }
  }).showToast();
}

function dropHandler(event) {
  event.preventDefault();
  if (event.dataTransfer.items) {
    const dt = new DataTransfer();
    let file;

    [...event.dataTransfer.items].forEach((item, i) => {
      if (item.kind === "file") {
        file = item.getAsFile();
        dt.items.add(file);
      }
    });

    modo = document.querySelector('.selection').getAttribute("data-modo-atual-conversao");
    if (modo === "PFX") {
      if (dt.files.length < 2) {
        const allowedExtensions = ['.pfx', '.p12'];
        const fileExtension = obterExtensaoArquivo(file.name);

        if (allowedExtensions.includes(fileExtension.toLowerCase())) {
          document.getElementById('pfxFile').files = dt.files;

          const nome = file.name.length > 25 ? file.name.substring(0, 25) + "..." : file.name;
          document.getElementById("nomeArquivo").innerText = nome;
          document.getElementById("file").classList.add("hidden");
          document.querySelector(".container").style.display = "flex";
          document.getElementById("senhaParaPFX").value = "";
          document.querySelector(".main").style.display = "none";

        } else {
          notification("Erro de extensão! Somente arquivos .pfx e .p12 são permitidos.");
          document.querySelector('.selection').style.border = 'none';
        }
      } else {
        notification("Não é permitido converter dois arquivos ao mesmo tempo, porfavor tente converter um de cada vez.");
        document.querySelector('.selection').style.border = 'none';
      }
    };
    if (modo === "CRT_KEY") {
      if (dt.files.length < 3) {
        const allowedExtensions = ['.key', '.crt'];
        
      } else {
        notification("Não é permitido converter mais que dois arquivos, sendo eles um .key e um .crt");
        document.querySelector('.selection').style.border = 'none';
      }
    }
  }
}

function obterExtensaoArquivo(nomeDoArquivo) {
  const indiceExtensao = nomeDoArquivo.lastIndexOf('.');
  if (indiceExtensao !== -1) {
    return nomeDoArquivo.slice(indiceExtensao);
  } else {
    return '';
  }
}

function dragOverHandler(ev) {
  ev.preventDefault();
  const divSelection = document.querySelector('.selection');
  divSelection.style.border = '1px dashed #330253'
  ev.target.addEventListener('dragleave', function () {
    divSelection.style.border = 'none';
  });
}