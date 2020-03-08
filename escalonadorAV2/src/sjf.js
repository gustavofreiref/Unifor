(function(window, document) {
  // localiza e pega no HTML do buttom
  const button = document.querySelector("#button");
  // escreve o botão como iniciar simulação
  button.innerHTML = '<button type="button" id="btiniciar">Iniciar Simulação</button>';

  "use strict";

  const Estado = {
    PRONTO: "Pronto",
    EM_EXECUCAO: "Executando",
    ENCERRADO: "Encerrado"
  };
  // cria processo
  const Processo = (id, estado, adicionado=false) => {
    ramdomNumber = Math.floor(Math.random() * 16) + 4
    return {id: id, tempo_total: ramdomNumber, contagem: ramdomNumber, estado: estado, adicionado: adicionado}
  }
  // função de espera no javascript
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // ordena a lista de espera por tempo_total, bubble sort
  const Organizador = (sjf) => {
    for (let i = 0; i < sjf.length; i++) {
      for (let j = 0; j < sjf.length; j++) {
        if (sjf[i].tempo_total < sjf[j].tempo_total) {
          const aux = sjf[i];
          sjf[i] = sjf[j];
          sjf[j] = aux;
        }
      }
    }
    return sjf;
  }
  //cria a lista de espera(estado Pronto)
  const ListaDeEspera = (quantidade) => {
    // cria a lista
    let sjf=[];
    for (let i=1; i <= quantidade; i++){
      // insere processos na lista
      sjf.push(Processo(i, Estado.PRONTO));
    }
    //organiza
    return Organizador(sjf);
  };

  // escreve o HTML da lista de Pronto
  const escrevePronto = (listaDeEspera) => {
    // Localiza e pega o HTML da tabela de Pronto
    const tabela = document.querySelector("#tabela-prontos");
    //escreve o cabeçalho da tabela
    let linha = "<tr><th>ID</th><th>Tempo Execução</th><th>Tempo Restante</th><th>Estado</th></tr>";
    for ( let i = 0; i < listaDeEspera.length; ++i) {
      // verifica se o processo é um adcionado
      if (listaDeEspera[i].adicionado) {
        // se for adcionado, escreve a linha vermelha
        linha += "<tr class='red'><td>"+listaDeEspera[i].id+"</td><td>"+listaDeEspera[i].tempo_total+"</td><td>"+listaDeEspera[i].contagem+"</td><td>"+listaDeEspera[i].estado+"</td></tr>";
      }else{
        // senão, escreve a linha preta
        linha += "<tr><td>"+listaDeEspera[i].id+"</td><td>"+listaDeEspera[i].tempo_total+"</td><td>"+listaDeEspera[i].contagem+"</td><td>"+listaDeEspera[i].estado+"</td></tr>";
      }
    }
    tabela.innerHTML = linha;
  };
  // escreve HTML da lista de Execução
  const escreveExecucao = (core) => {
    const tabela = document.querySelector("#tabela-execucao");
    let linha = "<tr><th>ID</th><th>ID Processo</th><th>Tempo Execução</th><th>Tempo Restante</th><th>Estado</th></tr>";
    for ( let i = 0; i < core.length; ++i) {
      if (core[i] != null){
        if (core[i].adicionado) {
          linha += "<tr class='red'><td>"+(i+1)+"</td><td>"+core[i].id+"</td><td>"+core[i].tempo_total+"</td><td>"+core[i].contagem+"</td><td>"+core[i].estado+"</td></tr>";
        }else{
          linha += "<tr><td>"+(i+1)+"</td><td>"+core[i].id+"</td><td>"+core[i].tempo_total+"</td><td>"+core[i].contagem+"</td><td>"+core[i].estado+"</td></tr>";
        }
      }
    }
    tabela.innerHTML = linha;
  };
  // escreve HTML da lista de Terminado
  const escreveTerminado = (terminado) => {
    const tabela = document.querySelector("#tabela-terminado");
    let linha = "<tr><th>ID</th><th>Tempo Execução</th><th>Tempo Restante</th><th>Estado</th></tr>";
    for ( let i = 0; i < terminado.length; ++i) {
      if (terminado[i].adicionado) {
        linha += "<tr class='red'><td>"+terminado[i].id+"</td><td>"+terminado[i].tempo_total+"</td><td>"+terminado[i].contagem+"</td><td>"+terminado[i].estado+"</td></tr>";
      }else{
        linha += "<tr><td>"+terminado[i].id+"</td><td>"+terminado[i].tempo_total+"</td><td>"+terminado[i].contagem+"</td><td>"+terminado[i].estado+"</td></tr>";
      }
    }
    tabela.innerHTML = linha;
  };

  // inicia a lista de cores, setando tudo como vazio
  const InitListaDeCores = (quantidade) => {
    let cores = [];
    for (let i=1; i <= quantidade; i++){
      cores.push(null);
    }
    return cores;
  }
  
  // inicio do simulador
  const Simulador = async() => {
    // localiza e pega o HTML dos valores
    const quantidadeProcessos = document.querySelector("#quantidadeProcessos").value;
    const quantidadeCores = document.querySelector("#quantidadeCores").value;
    
    // reescreve o botão de iniciar processo para adicionar processo
    button.innerHTML = '<button type="button" id="addprocesso">Adicionar Processo</button>';
    
    // localiza e pega o HTML do novo botão
    const addprocessobt = document.querySelector("#addprocesso");

    // Cria a lista de espera, cores e terminado
    let listaDeEspera = ListaDeEspera(quantidadeProcessos);
    let core = InitListaDeCores(quantidadeCores);
    let terminado = [];

    // escreve o Html Inicial
    escrevePronto(listaDeEspera);
    escreveExecucao(core);
    escreveTerminado(terminado);

    // função que retorna o numero cores que estão sendo utilizado 
    const totalCoreUtilizado = () => {
      let cont = 0;
      for (let i = 0; i < core.length; i++) {
        if (core[i] != null){
          cont++;
        }
      }
      return cont;
    }
    
    // Cria um processo e adiciona ele a lista de espera
    const AddListaDeEspera = () => {
      // cria um processo e adiciona no final da lista de espera
      listaDeEspera.push(Processo(listaDeEspera.length + totalCoreUtilizado() + terminado.length + 1, Estado.PRONTO, true));
      // reorganiza a lista de espera
      listaDeEspera = Organizador(listaDeEspera);
      escrevePronto(listaDeEspera);
      // tenta rodar caso tenha um core ocioso
      run();
    };

    // captura o click do botão adcionar processo
    addprocessobt.addEventListener("click", () => {
      AddListaDeEspera();
    });

    // Tira o processo do Core
    const LiberaProcesso = (id) => {
      // procura o processo dentro do core
      for ( let i = 0; i < core.length; ++i) {
        if (core[i] != null){
          if (core[i].id == id){
            core[i].estado = Estado.ENCERRADO;
            terminado.push(core[i]);
            core[i] = null;
            // para a execução do for
            break;
          }
        }
      }
    }

    // faz o processo de contagem até terminar o processo
    const Contagem = async(processo) => {
      // validação para ver se a contagem chegou a 0, se sim, termina tudo;
      if (processo.contagem == 0) {
        return null;
      }
      // espera 1 segundo
      await sleep(1000);
      processo.contagem--;
      escreveExecucao(core);
      // chama ele mesmo recursivamente 
      await Contagem(processo);
      return null;
    }
    // inicia a contagem
    const Iniciar = async(processo) => {
      await Contagem(processo);
    };

    // adiciona o proximo processo ao core quando ele estiver vazio
    const AddProcesso = async(processo) => {
      for ( let i = 0; i < core.length; ++i) {
        if (core[i] == null){
          core[i] = processo;
          processo.estado = Estado.EM_EXECUCAO;
          break;
        }
      }
      escreveExecucao(core);
      // inicia o processo
      await Iniciar(processo);
      // ao terminar libera o processo do core
      LiberaProcesso(processo.id);
      escreveExecucao(core);
    }

    // verifica se há algum core vazio
    const coreVazio = () => {
      for (let i = 0; i < core.length; i++) {
        if (core[i] == null){
          return true;
        }
      }
      return false;
    }
    
    // inicia o processo de 1 core caso ele esteja livre
    const run = async() => {
      if (await coreVazio()){
        // tira o primeiro da lista de espera
        let processo = listaDeEspera.shift()
        escrevePronto(listaDeEspera);
        // verifica se há algum processo
        if (processo){
          // inicia processo no core
          await AddProcesso(processo);
          escreveTerminado(terminado);
          // quando termina, faz tudo de novo
          run();
        }
      }
    };
    // espera 2 segundos antes de iniciar
    await sleep(2000);
    // Inicia a execução em cada core
    for (let i = 0; i < core.length; ++i) {
      run();
    }
  }
  
  // localiza e pega no HTML o botão iniciar
  const btiniciar = document.querySelector("#btiniciar");
  
  // Ação de quando clicar no botão iniciar processo
  btiniciar.addEventListener("click", () => {
    Simulador();
  });
})(window, document);