(function(window, document) {

  const button = document.querySelector("#button");
  button.innerHTML = '<button type="button" id="btiniciar">Iniciar Simulação</button>';

  "use strict";

  const Estado = {
    PRONTO: "Pronto",
    EM_EXECUCAO: "Executando",
    ENCERRADO: "Encerrado"
  };
  
  const Processo = (id, estado, adicionado=false) => {
    ramdomNumber = Math.floor(Math.random() * 16) + 4
    return {id: id, tempo_total: ramdomNumber, tempo_restante_inicial: ramdomNumber, tempo_restante: ramdomNumber, contagem: null, estado: estado, adicionado: adicionado}
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
    let linha = "<tr><th>ID</th><th>Tempo Execução</th><th>Tempo Restante</th><th>Estado</th></tr>";
    for ( let i = 0; i < listaDeEspera.length; ++i) {
      if (listaDeEspera[i].adicionado) {
        linha += "<tr class='red'><td>"+listaDeEspera[i].id+"</td><td>"+listaDeEspera[i].tempo_total+"</td><td>"+listaDeEspera[i].tempo_restante_inicial+"</td><td>"+listaDeEspera[i].estado+"</td></tr>";
      }else{
        linha += "<tr><td>"+listaDeEspera[i].id+"</td><td>"+listaDeEspera[i].tempo_total+"</td><td>"+listaDeEspera[i].tempo_restante_inicial+"</td><td>"+listaDeEspera[i].estado+"</td></tr>";
      }
    }
    tabela.innerHTML = linha;
  };

  const escreveExecucao = (core) => {
    const tabela = document.querySelector("#tabela-execucao");
    let linha = "<tr><th>ID</th><th>ID Processo</th><th>Tempo Execução</th><th>Tempo Restante</th><th>Tempo Quantum</th><th>Estado</th></tr>";
    for ( let i = 0; i < core.length; ++i) {
      if (core[i] != null){
        if (core[i].adicionado) {
          linha += "<tr class='red'><td>"+(i+1)+"</td><td>"+core[i].id+"</td><td>"+core[i].tempo_total+"</td><td>"+core[i].tempo_restante+"</td><td>"+core[i].contagem+"</td><td>"+core[i].estado+"</td></tr>";
        }else{
          linha += "<tr><td>"+(i+1)+"</td><td>"+core[i].id+"</td><td>"+core[i].tempo_total+"</td><td>"+core[i].tempo_restante+"</td><td>"+core[i].contagem+"</td><td>"+core[i].estado+"</td></tr>";
        }
      }
    }
    tabela.innerHTML = linha;
  };

  const escreveTerminado = (terminado) => {
    const tabela = document.querySelector("#tabela-terminado");
    let linha = "<tr><th>ID</th><th>Tempo Execução</th><th>Tempo Restante</th><th>Estado</th></tr>";
    for ( let i = 0; i < terminado.length; ++i) {
      if (terminado[i].adicionado) {
        linha += "<tr class='red'><td>"+terminado[i].id+"</td><td>"+terminado[i].tempo_total+"</td><td>"+terminado[i].tempo_restante_inicial+"</td><td>"+terminado[i].estado+"</td></tr>";
      }else{
        linha += "<tr><td>"+terminado[i].id+"</td><td>"+terminado[i].tempo_total+"</td><td>"+terminado[i].tempo_restante_inicial+"</td><td>"+terminado[i].estado+"</td></tr>";
      }
    }
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
    const button = document.querySelector("#button");
    
    button.innerHTML = '<button type="button" id="addprocesso">Adicionar Processo</button>';
    
    const addprocessobt = document.querySelector("#addprocesso");
  
    let listaDeEspera = ListaDeEspera(quantidadeProcessos);
    let core = InitListaDeCores(quantidadeCores);
    let terminado = [];
    
    escrevePronto(listaDeEspera);
    escreveExecucao(core);
    escreveTerminado(terminado);

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
      await Contagem(processo);
      return null;
    }
    
    const Iniciar = async(processo) => {
      // seta a contagem para o tempo do quantum
      processo.contagem = tempoQuantum;
      escreveExecucao(core);
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
        if (processo){
          await AddProcesso(processo);
          escreveTerminado(terminado);
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