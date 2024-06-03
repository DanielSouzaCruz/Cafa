function tela_crtkey(){
    return `
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
        <input type="password" id="senhaParaPFX" placeholder="Senha para Converter"  autocomplete="off">
      </div>
    </div>
    <button class="download-button-files" onclick="converterCrtAndKeyToPfx()">Download</button>
  </div>

  <main class="main">
    <input onchange="escolherKey_Crt(event)" type="file" id="file" accept=".crt,.key" multiple>
    <input type="file" id="crtFile" style="display:none">
    <input type="file" id="keyFile" style="display:none">
    <label class="botaoSelecionarFiles" for="file">
      <img src="../images/upload.png" alt="upload de arquivo" style="width: 30px;">Selecione os arquivos
    </label>
    <p id="msgForUser">Selecione ou Arraste os arquivos (.crt ou .key)</p>
  </main>
    `;
}