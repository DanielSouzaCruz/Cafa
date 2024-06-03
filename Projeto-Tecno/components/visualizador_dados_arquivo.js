function visualizador_dados_arquivoKeyCrt(nomeArquivo, nomeAExibir){
    return `
          <div class="grid_inputs">
            <img src="../images/file-image.png" alt="arquivo" class="arquive"  style="width: 40px;">
            <p class="file-name" id="nomeArquivo" data-nomeCompletoArquivo="${nomeArquivo}">${nomeAExibir}</p>
            <img src="../images/x.png" alt="close" class="close" onclick="fecharArquivoKey_Crt(event)">  
          </div>
          `;
}