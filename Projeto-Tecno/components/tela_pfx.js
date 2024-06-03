function tela_pfx(){
    return `
    <main class="main">
     <input type="file" id="pfxFile" style="display:none">
      <input onchange="escolherPfx(event)" type="file" id="file" accept=".pfx,.p12">
      <label class="botaoSelecionarFiles" for="file" id="file"">
        <img src="../images/upload.png" alt="upload de arquivo" style="width: 30px;">Selecione o arquivo
      </label>
      <p id="msgForUser">Selecione ou Arraste um arquivo (.pfx)</p>
    </main>

    <div class="container" style="display: none;">
    <div class="grid">
      <img src="../images/file-image.png" alt="arquivo" class="arquive" style="width: 40px;">
      <p class="file-name" id="nomeArquivo"></p>
      <img src="../images/x.png" alt="close" class="close" onclick="fecharArquivo()">
    </div>
    <div class="password-name">
      <div class="row">
        <input type="password" id="senhaParaPFX" placeholder="Senha para Verificar Certificado" autocomplete="off"
          style="width: 300px">
      </div>
    </div>
    <button class="download-button" onclick="converterPfxToCrtAndKey()">Download</button>
  </div>
  `;
}