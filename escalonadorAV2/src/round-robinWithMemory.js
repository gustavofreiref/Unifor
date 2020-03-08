(function(window, document) {

  const button = document.querySelector("#button");
  button.innerHTML = '<button type="button" id="btiniciar">Iniciar Simulação</button>';

  "use strict";

  const Estado = {
    PRONTO: "Pronto",
    EM_EXECUCAO: "Executando",
    ENCERRADO: "Encerrado",
    ABORTADO: "Abortado"
  };

  const Processo = (id, estado, adicionado=false) => {
    ramdomNumber = Math.floor(Math.random() * 20) + 10
    ramdomNumber2 = Math.floor(Math.random() * 992) + 32
    return {id: id, tamanhoMemoria: ramdomNumber2, tamanhoTotalMemoria: ramdomNumber2, tempo_total: ramdomNumber, tempo_restante_inicial: ramdomNumber, tempo_restante: ramdomNumber, contagem: null, estado: estado, adicionado: adicionado}
  }
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  const ListaDeEspera = (quantidade) => {
    let fifo=[];
    for (let i=1; i <= quantidade; i++){
      fifo.push(Processo(i, Estado.PRONTO));
    }
    return fifo;
  };

  const escrevePronto = (listaDeEspera) => {
    const tabela = document.querySelector("#tabela-prontos");
    let linha = "<tr><th>ID</th><th>Tempo Execução</th><th>Tempo Restante</th><th>Bytes</th><th>Estado</th></tr>";
    for ( let i = 0; i < listaDeEspera.length; ++i) {
      if (listaDeEspera[i].adicionado) {
        linha += "<tr class='red'><td>"+listaDeEspera[i].id+"</td><td>"+listaDeEspera[i].tempo_total+"</td><td>"+listaDeEspera[i].tempo_restante_inicial+"</td><td>"+listaDeEspera[i].tamanhoTotalMemoria+"</td><td>"+listaDeEspera[i].estado+"</td></tr>";
      }else{
        linha += "<tr><td>"+listaDeEspera[i].id+"</td><td>"+listaDeEspera[i].tempo_total+"</td><td>"+listaDeEspera[i].tempo_restante_inicial+"</td><td>"+listaDeEspera[i].tamanhoTotalMemoria+"</td><td>"+listaDeEspera[i].estado+"</td></tr>";
      }
    }
    tabela.innerHTML = linha;
  };

  const escreveExecucao = (core) => {
    const tabela = document.querySelector("#tabela-execucao");
    let linha = "<tr><th>ID Core</th><th>ID Processo</th><th>Tempo Execução</th><th>Tempo Restante</th><th>Tempo Quantum</th><th>Bytes</th><th>Estado</th></tr>";
    for ( let i = 0; i < core.length; ++i) {
      if (core[i] != null){
        if (core[i].adicionado) {
          linha += "<tr class='red'><td>"+(i+1)+"</td><td>"+core[i].id+"</td><td>"+core[i].tempo_total+"</td><td>"+core[i].tempo_restante+"</td><td>"+core[i].contagem+"</td><td>"+core[i].tamanhoTotalMemoria+"</td><td>"+core[i].estado+"</td></tr>";
        }else{
          linha += "<tr><td>"+(i+1)+"</td><td>"+core[i].id+"</td><td>"+core[i].tempo_total+"</td><td>"+core[i].tempo_restante+"</td><td>"+core[i].contagem+"</td><td>"+core[i].tamanhoTotalMemoria+"</td><td>"+core[i].estado+"</td></tr>";
        }
      }
    }
    tabela.innerHTML = linha;
  };

  const escreveTerminado = (terminado) => {
    const tabela = document.querySelector("#tabela-terminado");
    let linha = "<tr><th>ID</th><th>Tempo Execução</th><th>Tempo Restante</th><th>Bytes</th><th>Estado</th></tr>";
    for ( let i = 0; i < terminado.length; ++i) {
      if (terminado[i].adicionado) {
        linha += "<tr class='red'><td>"+terminado[i].id+"</td><td>"+terminado[i].tempo_total+"</td><td>"+terminado[i].tempo_restante_inicial+"</td><td>"+terminado[i].tamanhoTotalMemoria+"</td><td>"+terminado[i].estado+"</td></tr>";
      }else{
        linha += "<tr><td>"+terminado[i].id+"</td><td>"+terminado[i].tempo_total+"</td><td>"+terminado[i].tempo_restante_inicial+"</td><td>"+terminado[i].tamanhoTotalMemoria+"</td><td>"+terminado[i].estado+"</td></tr>";
      }
    }
    tabela.innerHTML = linha;
  };

  const escreveBlocos = (blocos, blocosLivres) => {
    const tabela = document.querySelector("#tabela-blocos");    
    let linha = "<tr><th>ID Bloco</th><th>ID Processo</th><th>Tamanho Bloco</th><th>Tamanho Processo</th></tr>";    
    for ( let i = 0; i < blocos.length; ++i) {
        if(blocosLivres.indexOf(blocos[i].id) !== -1){
          linha += "<tr class='green'><td>"+blocos[i].id+"</td><td>"+blocos[i].idProcesso+"</td><td>"+blocos[i].tamanhoMemoria+"</td><td>"+blocos[i].tamanhoProcesso+"</td></tr>";          
        }else{
          linha += "<tr class='red'><td>"+blocos[i].id+"</td><td>"+blocos[i].idProcesso+"</td><td>"+blocos[i].tamanhoMemoria+"</td><td>"+blocos[i].tamanhoProcesso+"</td></tr>";                    
        }
    }
    tabela.innerHTML = linha;
  };

  const escreveTamanhoMemoria = (tamanhoMemoria, blocos, blocosLivres) => {
    const tabela = document.querySelector("#tabela-memoria");    
    let linha = "<tr><th>Total</th><th>Total Alocado</th><th>Total Usado</th><th>Total Alocado (%)</th></tr>";
    let tamanhoAlocado = 0;
    let tamanhoUsado = 0;
    for (let i=0; i < blocos.length; i++){
      tamanhoAlocado += blocos[i].tamanhoMemoria;
      if(blocosLivres.indexOf(blocos[i].id) === -1){
        tamanhoUsado += blocos[i].tamanhoProcesso;
      }
    }
    linha += "<tr><td>"+tamanhoMemoria+"</td><td>"+tamanhoAlocado+"</td><td>"+tamanhoUsado+"</td><td>"+(tamanhoAlocado/tamanhoMemoria)*100+"</td></tr>";
    tabela.innerHTML = linha;
  };

  const InitListaDeCores = (quantidade) => {
    let cores = [];
    for (let i=1; i <= quantidade; i++){
      cores.push(null);
    }
    return cores;
  }
  
  const Simulador = async() => {
    const quantidadeProcessos = document.querySelector("#quantidadeProcessos").value;
    const quantidadeCores = document.querySelector("#quantidadeCores").value;
    const tempoQuantum = document.querySelector("#tempoQuantum").value;
    const tamanhoMemoria = document.querySelector("#tamanhototaldamemoria").value;
    const algoritimo = document.querySelector("#algoritimo-memoria").value;
    const checkboxalocacaodinamica = document.querySelector("#alocacao-dinamica").checked;
    const button = document.querySelector("#button");
    
    button.innerHTML = '<button type="button" id="addprocesso">Adicionar Processo</button>';
    
    const addprocessobt = document.querySelector("#addprocesso");
  
    let listaDeEspera = ListaDeEspera(quantidadeProcessos);
    let core = InitListaDeCores(quantidadeCores);
    let blocos = [];
    let blocosLivres = [];
    let terminado = [];
    
    escreveBlocos(blocos, blocosLivres);
    escreveTamanhoMemoria(tamanhoMemoria, blocos, blocosLivres);
    escrevePronto(listaDeEspera);
    escreveExecucao(core);
    escreveTerminado(terminado);

    // Verifica se o processo está ocupando algum bloco
    const VerificaBloco = (processo) => {
      for (let i=0; i < blocos.length; i++){
        if (blocos[i].idProcesso == processo.id){
          return true;
        }
      }
      return false;
    }

    // escreve o id do bloco na lista de blocos livres
    const LiberaBloco = (processo) => {
      for (let i=0; i < blocos.length; i++){
        if (blocos[i].idProcesso == processo.id){
          blocosLivres.push(blocos[i].id);
          blocosLivres.sort();
        }
      }
    }

    // algoritimo de FirstFit
    const FirstFit = (processo, alocacaoDinamica) => {
      let memoriaASerAlocada = processo.tamanhoMemoria;
      if (alocacaoDinamica != null){
        memoriaASerAlocada = alocacaoDinamica;
      }
      // percorre a lista de blocos livres
      for (let i=0; i < blocosLivres.length; i++){
        // verifica se há algum compativel por ordem
        if (blocos[blocosLivres[i] - 1].tamanhoMemoria >= memoriaASerAlocada){
          // coloca o processo no bloco comparivel e remove da lista de livres
          blocos[blocosLivres[i] - 1].idProcesso = processo.id;
          blocos[blocosLivres[i] - 1].tamanhoProcesso = memoriaASerAlocada;
          blocosLivres.splice(i, 1);
          return null;
        }
      }
      // caso não haja nenhum compativel, aborta processo e joga para fila de terminados
      processo.estado = Estado.ABORTADO;
      terminado.push(processo);
      LiberaBloco(processo);
    }
    
    const BestFit = (processo, alocacaoDinamica) => {
      // verifica se a requisição é de uma alocação dinamica ou normal
      let memoriaASerAlocada = processo.tamanhoMemoria;
      if (alocacaoDinamica != null){
        memoriaASerAlocada = alocacaoDinamica;
      }
      // declara variavel que vai armazenar a melhor opção
      melhorBlocoLivre = {id: null, tamanhoMemoria: 1025};
      for (let i=0; i < blocosLivres.length; i++){
        // verifica se é compativel
        if (blocos[blocosLivres[i] - 1].tamanhoMemoria >= memoriaASerAlocada){
          // verifica se o bloco é melhor que o anterior já visto
          if (blocos[blocosLivres[i] - 1].tamanhoMemoria <= melhorBlocoLivre.tamanhoMemoria){
            // se for melhor, armazena
            melhorBlocoLivre.id = blocos[blocosLivres[i] - 1].id;
            melhorBlocoLivre.tamanhoMemoria = blocos[blocosLivres[i] - 1].tamanhoMemoria;
          }
        }
      }
      // verifica se houve algum bloco compativel
      if (melhorBlocoLivre.id != null){
        // procura o id bloco compativel
        for (let i=0; i < blocosLivres.length; i++){
          // verifica se é esse bloco
          if (blocos[blocosLivres[i] - 1].id == melhorBlocoLivre.id){
            // coloca o processo no bloco compativel e remove da lista de livres
            blocos[blocosLivres[i] - 1].idProcesso = processo.id;
            blocos[blocosLivres[i] - 1].tamanhoProcesso = memoriaASerAlocada;
            blocosLivres.splice(i, 1);
            return null;
          }
        }
      }
      // caso não haja nenhum compativel, aborta processo e joga para fila de terminados
      processo.estado = Estado.ABORTADO;
      terminado.push(processo);
      LiberaBloco(processo);
    }

    const AlocaMemoria = (processo, alocacaoDinamica=null) => {
      let tamanhoAlocado = 0;
      // percorre todos os blocos e soma os tamanhos
      for (let i=0; i < blocos.length; i++){
        tamanhoAlocado += blocos[i].tamanhoMemoria;
      }
      
      let memoriaASerAlocada = processo.tamanhoMemoria;
      if(alocacaoDinamica != null){
        // se for alocacao dinamica, usa o valor da alocacao dinamica e soma o valor ao total do processo 
        processo.tamanhoTotalMemoria = processo.tamanhoTotalMemoria + alocacaoDinamica;
        memoriaASerAlocada = alocacaoDinamica;
      }
      // verifica se ainda há memoria restante para criar um novo bloco
      if (tamanhoMemoria >= tamanhoAlocado + memoriaASerAlocada){
        // caso haja espaço na memoria, cria-se um novo bloco
        blocos.push({id: blocos.length+1, idProcesso: processo.id, tamanhoMemoria: memoriaASerAlocada, tamanhoProcesso: memoriaASerAlocada})
      } else {
        // caso nao haja espaço livre na memoria, tenta alocar nos blocos existentes usando os algoritimos.
        // verifica se existem blocos livres
        if (blocosLivres.length != 0){
          // first Fit Algoritimo
          if (algoritimo == 'first-fit'){
            FirstFit(processo, alocacaoDinamica);
            return null;
          }

          // Best Fit Algoritimo
          if (algoritimo == 'best-fit'){
            BestFit(processo, alocacaoDinamica);
            return null;
          }
        } else {
          // se não existir blocos livres, o processo é abortado e jogado para fila de terminados
          processo.estado = Estado.ABORTADO;
          terminado.push(processo);
          LiberaBloco(processo);
          return null;
        }
      }
    }

    const totalCoreUtilizado = () => {
      let cont = 0;
      for (let i = 0; i < core.length; i++) {
        if (core[i] != null){
          cont++;
        }
      }
      return cont;
    }
    
    const AddListaDeEspera = () => {
      listaDeEspera.push(Processo(listaDeEspera.length + totalCoreUtilizado() + terminado.length + 1, Estado.PRONTO, true));
      escrevePronto(listaDeEspera);
      escreveBlocos(blocos, blocosLivres);
      escreveTamanhoMemoria(tamanhoMemoria, blocos, blocosLivres);
      run();
    };

    addprocessobt.addEventListener("click", () => {
      AddListaDeEspera();
    });

    const LiberaProcesso = (id) => {
      for ( let i = 0; i < core.length; ++i) {
        if (core[i] != null){
          if (core[i].id == id){
            // verifica se ainda há tempo restante para ser executado
            if ((core[i].tempo_restante_inicial - tempoQuantum) > 0){
              // caso não tenha terminado
              core[i].tempo_restante_inicial -= tempoQuantum;
              core[i].estado = Estado.PRONTO;
              listaDeEspera.push(core[i]);
            } else {
              //caso termine
              core[i].tempo_restante_inicial = 0;
              core[i].estado = Estado.ENCERRADO;
              terminado.push(core[i]);
              // caso termine totalmente o processo, libera a memoria
              LiberaBloco(core[i]);
            }
            // esvazia o core
            core[i] = null;
            break;
          }
        }
      }
    }

    const Contagem = async(processo) => {
      // verifica se o ciclo do quantum ou o tempo restante se esgotaram
      if (processo.contagem == 0 || processo.tempo_restante == 0) {
        return null;
      }
      // espera 1 segundo
      await sleep(1000);
      processo.contagem--;
      processo.tempo_restante--;
      escreveExecucao(core);
      escreveBlocos(blocos, blocosLivres);
      escreveTamanhoMemoria(tamanhoMemoria, blocos, blocosLivres);
      await Contagem(processo);
      return null;
    }
    
    const Iniciar = async(processo) => {
      // seta a contagem para o tempo do quantum
      processo.contagem = tempoQuantum;
      escreveExecucao(core);
      escreveBlocos(blocos, blocosLivres);
      escreveTamanhoMemoria(tamanhoMemoria, blocos, blocosLivres);
      // executa o processo do core
      await Contagem(processo);
    };
    
    const AddProcesso = async(processo) => {
      for ( let i = 0; i < core.length; ++i) {
        if (core[i] == null){
          core[i] = processo;
          processo.estado = Estado.EM_EXECUCAO;
          break;
        }
      }
      await Iniciar(processo);
      LiberaProcesso(processo.id);
      escreveExecucao(core);
      escreveBlocos(blocos, blocosLivres);
      escreveTamanhoMemoria(tamanhoMemoria, blocos, blocosLivres);
    }

    const coreVazio = async() => {
      for (let i = 0; i < core.length; i++) {
        if (core[i] == null){
          return true;
        }
      }
      return false;
    }
    
    const run = async() => {
      if (await coreVazio()){
        let processo = listaDeEspera.shift()
        escrevePronto(listaDeEspera);
        escreveBlocos(blocos, blocosLivres);
        escreveTamanhoMemoria(tamanhoMemoria, blocos, blocosLivres);
        if (processo){
          // verifica se o processo já está sendo usado por algum bloco
          if(VerificaBloco(processo)){
            // verifica se alocação dinamica está habilitada
            if (checkboxalocacaodinamica){
              // 20% de chance de alocar alguma memoria dinamincamente
              if (Math.floor(Math.random() * 100) <= 20){
                // caso caia nos 20%, aloca uma memoria de 32 a 200 bytes ao processo e incrementa o valor do processo
                AlocaMemoria(processo, Math.floor(Math.random() * 168) + 32)
              }
            }
            // verifica se o processo não está abortado
            if (processo.estado == Estado.PRONTO){
              // coloca o processo no core
              await AddProcesso(processo);
            }
          } else {
            // caso seja a primeira interação de alocação de memoria, aloca memoria do processo
            AlocaMemoria(processo);
            // verifica se o processo não está abortado
            if (processo.estado == Estado.PRONTO){
              // coloca o processo no core
              await AddProcesso(processo);
            }
          }
          escreveTerminado(terminado);
          escreveBlocos(blocos, blocosLivres);
          escreveTamanhoMemoria(tamanhoMemoria, blocos, blocosLivres);
          run();
        }
      }
    };
    await sleep(2000);
    for (let i = 0; i < core.length; ++i) {
      run();
    }
  }
  
  const btiniciar = document.querySelector("#btiniciar");
  
  btiniciar.addEventListener("click", () => {
    Simulador();
  });

  
})(window, document);