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

    if (nomeCompletoArquivo !== files[i].name)
      dt.items.add(file)
  }

  input.files = dt.files; // Atualiza o FileList com os arquivos que NÃO serão removidos

  event.target.parentElement.remove(); // remove da interface gráfica o div que mostra o arquivo e o botão de remover

  if (document.getElementById("containerArquivos").childElementCount == 0) { // caso o div que é 'pai' dos divs que mostram o arquivo não tenha mais nenhum arquivo, mostra novamente o selecionador de arquivos
    document.querySelector(".main").style.display = "grid"; // mostra o selecionador de arquivos
    document.querySelector(".container").style.display = "none";  // esconde  o visualizador de arquivos selecionados
  }

}

function escolherKey_Crt(event) {

  document.getElementById("containerArquivos").innerHTML = ""; // remove qualquer elemento filho do div que mostra os arquivos selecionados
  document.querySelector(".main").style.display = "none"; // esconde o selecionador de arquivos
  document.querySelector(".container").style.display = "flex"; // mostra o visualizador de arquivos selecionados

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

