//Referências para os elemetnos do modal
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("modal");
const fade = document.getElementById("fade");
const openModalBtnCiclo = document.getElementById("openModalBtnCiclo");
const closeModalBtnCiclo = document.getElementById("closeModalBtnCiclo");
const modalCiclo = document.getElementById("modalCiclo");
const fadeCiclo = document.getElementById("fadeCiclo");
const openModalNota = document.getElementById("open-modal-nota");
const closeModalNota = document.getElementById("close-modal-nota");
const ModalNota = document.querySelector("#modal-nota");
const fadeNota = document.querySelector("#fade-nota");

//Função para alterar a visibilidade do modal
const toggleModal = () => {
  modal.classList.toggle("hide");
  fade.classList.toggle("hide");
};

const toggleModalCiclo = () => {
  modalCiclo.classList.toggle("hide");
  fadeCiclo.classList.toggle("hide");
};

const toggleModalNota = (id) => {
  let modal = document.querySelector("#modal-nota-" + id);
  let fade = document.querySelector("#fade-nota-" + id);
  modal.classList.toggle("hide-nota");
  fade.classList.toggle("hide-nota");
};

window.addEventListener('load', () => {
  configurarEventoBotaoEditarAluno()

})

function configurarEventoBotaoEditarAluno(){
  let listaBotoes = document.querySelectorAll('.btnAlterarAluno')

  for (let botao of listaBotoes){
    botao.addEventListener('click', () => {
      let id = botao.getAttribute('data-id')
      fetch(window.location.origin + '/aluno/'+ id)
        .then(function(res){ return res.json(); })
        .then((resposta) => {
          console.log(resposta)
        })
        .catch()
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  [openModalBtnCiclo, closeModalBtnCiclo, fadeCiclo].forEach((el) => {
    el.addEventListener("click", () => toggleModalCiclo());
  });
});



// Função para Receber Notas

function receberNotas(id) {
  console.log(id);
  const notaAlunoInput = document.getElementById("nota" + id);

  const notaAluno = parseFloat(notaAlunoInput.value);

  if (notaAluno >= 0 && notaAluno <= 10) {
    const data = {
      "notas": notaAluno,
      "aluno_id": id,
      "ciclo_id": ciclo_id
    };
    fetch(window.location.origin + '/aluno/notas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json()).then(data => {
      console.log("Deu certo");
      console.log(data);
    });
  } else {
    console.log("deu errado");
  }
}


//Recebendo os dados inseridos no cadastrar turmas

function enviarDados() {
  //Referências dos elementos inseridos
  const nomeAlunoInput = document.getElementById("nomeAluno");
  const raInput = document.getElementById("ra");

  //Pegando os valores inseridos nos inputs
  const nomeAluno = nomeAlunoInput.value;
  const ra = raInput.value;

  //Criando uma lista de objeto com os dados das turmas
  const dados = {
    "Nome do Aluno": nomeAluno,
    "R.A": ra,
  };

  //exibindo o teste no navegador
  console.log(dados);

  //configurando a requisição POST
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados), //convertendo em JSON os objetos
  };

  const inserirAlunoDiv = document.getElementById("inserirAluno");


  // Função para Adicionar Aluno

  function adicionarAluno(aluno) {
    const alunoDiv = document.createElement("div");

    alunoDiv.classList.add("aluno");
    alunoDiv.innerHTML = `
    <span class="titulo">Nome:</span> ${aluno["Nome do Aluno"]}  
    <span class="titulo">R.A:</span> ${aluno["R.A"]}  
    <input id="nota${aluno["R.A"]}" type="text" placeholder="Nota"/>
    <button type="submit" onclick="receberNotas(${aluno["R.A"]})" class="btnNota">Teste</button>
    // <button type="submit" onclick="deleteAluno('${aluno["R.A"]}')" class="btnDeletar">Excluir Aluno</button>

  `;

    inserirAlunoDiv.appendChild(alunoDiv);
  }

  adicionarAluno(dados);

  // console.log(window.location)

  //Enviando a requisição POST para o servidor
  fetch(window.location.origin + "/aluno", option).catch((e) => {
    alert("Ocorreu um erro: " + e);
  });

  toggleModal();

  // Limpar os campos de entrada
  nomeAlunoInput.value = "";
  raInput.value = "";
}


// Função para Adicionar Ciclo

function adicionarCiclo() {
  const inicioCicloInput = document.getElementById("cicloInicio");
  const fimCicloInput = document.getElementById("cicloFim")

  const inicioCiclo = inicioCicloInput.value;
  const fimCiclo = fimCicloInput.value;
  // const turmaAtual = document.getElementById("nomeTurma").value

  console.log(inicioCiclo, fimCiclo);

  // Faça o fetch de ciclo
  fetch(window.location.origin + '/ciclo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      periodo_inicio: inicioCiclo,
      periodo_fim: fimCiclo,
      turma: turmaAtual
    })
  }).then(response => response.json()).then(data => {
    document.querySelector('#modalCiclo #modal-body').innerHTML += `<a class="ciclo-link" href="/ciclos/${data["id"]}">` + data["periodo_inicio"] + ' - ' + data["periodo_fim"] + '</a>'

    console.log(data);
  })
}


// Função para Deletar o Aluno

function deleteAluno(ra) {

  const option = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }


  fetch(window.location.origin + '/turma/' + turmaAtual + '/aluno/' + ra, option).then(response => {
    if (response.ok) {
      const alunoDiv = document.querySelector(`div[data-ra="${ra}"]`);
      alunoDiv.parentNode.removeChild(alunoDiv)
    } else {
      throw new Error('Erro ao deletar aluno')
    }
  })
    .catch((e) => {
      alert("Ocorreu um erro: " + e);
    });



  // Função para Alterar Alunos
  




  //Adicionando evento para fechar o modal ao click no button ou apertar tecla enter

  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        enviarDados();
      }
    });
  });
}
