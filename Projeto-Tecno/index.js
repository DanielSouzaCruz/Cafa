const { app, BrowserWindow } = require('electron')

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
      }
    }

  }

  // condicionais para controlar se o botão downlaod deve ou não aparecer E também se a seção seleção de arquivos deve ou não aparecer
  if (document.getElementById("crtFile").files.length == 1 && document.getElementById("keyFile").files.length == 1) {
    document.getElementsByClassName("download-button")[0].style.display = "inline-block";
    document.querySelector(".main").style.display = "none";
  } else {
    document.getElementsByClassName("download-button")[0].style.display = "none";
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
        document.getElementById("file").accept = ".key"; // define o filtro de seleção de arquivos key
      } else {
        document.getElementById("keyFile").files = event.target.files; // passa o arquivo selecionado para o input oculto de files key
        document.getElementById("msgForUser").innerText = "Agora selecione o arquivo CRT";
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
    } else {
      document.getElementsByClassName("download-button")[0].style.display = "none";
      document.querySelector(".main").style.display = "grid";
    }

    document.getElementById('file').files = dt.files; // Atualiza o FileList com os arquivos do armazenador temporário

    // itera sobre todos os arquivos do input que contém os arquivos selecionados
    for (let index = 0; index < event.target.files.length; index++) {
      let arquivo = {};

      arquivo.name = event.target.files[index].name;

      let nomeAExibir = arquivo.name.length > 25 ? arquivo.name.substring(0, 25) + "..." : arquivo.name;


      document.getElementById("containerArquivos").innerHTML += `
  <div class="grid">
    <img src="images/file-text.png" alt="arquivo" class="arquive">
    <p class="file-name" id="nomeArquivo" data-nomeCompletoArquivo="${arquivo.name}">${nomeAExibir}</p>
    <img src="images/x.png" alt="close" class="close" onclick="fecharArquivoKey_Crt(event)">  
  </div>
  `;
    }
  }
}

