//Referências para os elemetnos do modal
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("modal");
const fade = document.getElementById("fade");

//Função para alterar a visibilidade do modal
const toggleModal = () => {
  modal.classList.toggle("hide");
  fade.classList.toggle("hide");
};

[openModalBtn, closeModalBtn, fade].forEach((el) => {
  el.addEventListener("click", () => toggleModal());
});

//Recebendo os dados inseridos no cadastrar turmas
function enviarDados() {
  //Referências dos elementos inseridos
  const nomeTurmaInput = document.getElementById("nomeTurma");
  const professorInput = document.getElementById("professor");
  const turnoInput = document.getElementById("turno");
  const turmasInput = document.getElementById("turmasAdicionadas");

  //Pegando os valores inseridos nos inputs
  const nomeTurma = nomeTurmaInput.value;
  const professor = professorInput.value;
  const turno = turnoInput.value;
  const novaTurma = document.createElement("option")

  novaTurma.textContent = nomeTurma

  turmasInput.appendChild(novaTurma)

  //Criando uma lista de objeto com os dados das turmas
  const dados = {
    "Nome da Turma": nomeTurma,
    Professor: professor,
    Turno: turno,
    Alunos: []
  };

  //exibindo o teste no navegador
  console.log(dados);

  //configurando a requisição POST
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados), //convertendo em JSON os objetos
  }

  console.log(window.location)

  //Enviando a requisição POST para o servidor
  fetch(window.location.origin + '/turma', option).then(teste => {
    teste.text().then(id => {
      //Exibindo a resposta do servidor na página
      document.getElementById("inserirTurma").innerHTML += `<a class=turma href="/turmas/${id}">` + " " + id + '</a>'
      console.log(id + "este é o text")
    })
  }).catch(e => {
    console.log(e);
  });

  toggleModal();

  // Limpar os campos de entrada
  nomeTurmaInput.value = "";
  professorInput.value = "";
  turnoInput.value = "";
}

//Adicionando evento para fechar o modal ao click no button ou apertar tecla enter
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      enviarDados();
    }
  });
});

//Referências para os elemetnos do modal
const openModalBtnAluno = document.getElementById("openModalBtnAluno");
const closeModalBtnAluno = document.getElementById("closeModalBtnAluno");
const modalAluno = document.getElementById("modalAluno");
const fadeAluno = document.getElementById("fadeAluno");

//Função para alterar a visibilidade do modalAluno
const toggleModalAluno = () => {
  modalAluno.classList.toggle("hide");
  fadeAluno.classList.toggle("hide");
};

[openModalBtnAluno, closeModalBtnAluno, fadeAluno].forEach((el) => {
  el.addEventListener("click", () => toggleModalAluno());
});

//Referências para os elemetnos do modal
const openModalBtnProfessor = document.getElementById("openModalBtnProfessor");
const closeModalBtnProfessor = document.getElementById("closeModalBtnProfessor");
const modalProfessor = document.getElementById("modalProfessor");
const fadeProfessor = document.getElementById("fadeProfessor");

//Função para alterar a visibilidade do modalAluno
const toggleModalProfessor = () => {
  modalProfessor.classList.toggle("hide");
  fadeProfessor.classList.toggle("hide");
};

[openModalBtnProfessor, closeModalBtnProfessor, fadeProfessor].forEach((el) => {
  el.addEventListener("click", () => toggleModalProfessor());
});

//Recebendo os dados inseridos no cadastrar professor
function enviarDadosProfessor() {
  // Referências dos elementos inseridos
  const nomeProfessorInput = document.getElementById("nomeProfessor");
  const raInput = document.getElementById("raProfessor");
  const emailInput = document.getElementById("email");
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  // Pegando os valores inseridos nos inputs
  const nomeProfessor = nomeProfessorInput.value;
  const ra = raInput.value;
  const email = emailInput.value;
  const turmasSelecionadas = [];

  checkboxes.forEach(checkbox => {
    turmasSelecionadas.push(checkbox.value);
    console.log(turmasSelecionadas)
  });

  // Criando um objeto com os dados do Professor, incluindo as turmas selecionadas
  const dados = {
    "Nome do Professor": nomeProfessor,
    "R.A": ra,
    "turmas": turmasSelecionadas,
    "email": email
  };

  // exibindo os dados no navegador
  console.log(dados);

  // configurando a requisição POST
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados), // convertendo em JSON os objetos
  }

  // Enviando a requisição POST para o servidor
  fetch(window.location.origin + '/cadastrar-professor', option).catch(e => {
    console.log(e);
  });

  toggleModalProfessor();

  // Limpar os campos de entrada
  nomeProfessorInput.value = "";
  raInput.value = "";
  emailInput.value = "";
}

//Recebendo os dados inseridos no cadastrar turmas
function enviarDadosAluno() {
  // Referências dos elementos inseridos
  const nomeAlunoInput = document.getElementById("nomeAluno");
  const raInput = document.getElementById("ra");
  const emailInputAluno = document.getElementById("emailAluno");
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  // Pegando os valores inseridos nos inputs
  const nomeAluno = nomeAlunoInput.value;
  const ra = raInput.value;
  const emailAluno = emailInputAluno.value;
  const turmasSelecionadas = [];

  checkboxes.forEach(checkbox => {
    turmasSelecionadas.push(checkbox.value);
    console.log(turmasSelecionadas)
  });

  // Criando um objeto com os dados do aluno, incluindo as turmas selecionadas
  const dados = {
    "Nome do Aluno": nomeAluno,
    "R.A": ra,
    "email do Aluno": emailAluno,
    "turmas": turmasSelecionadas
  };

  // exibindo os dados no navegador
  console.log(dados);

  // configurando a requisição POST
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados), // convertendo em JSON os objetos
  }

  // Enviando a requisição POST para o servidor
  fetch(window.location.origin + '/aluno', option).catch(e => {
    console.log(e);
  });

  toggleModalAluno();

  // Limpar os campos de entrada
  nomeAlunoInput.value = "";
  raInput.value = "";
  emailInputAluno.value = "";
}

document.getElementById('converterBtn').addEventListener('click', () => {
  fetch('/converter', {
    method: 'POST'
  })
    .then(response => {
      if (response.ok) {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(new Blob([response.blob], { type: 'text/csv' }));
        link.download = 'saida.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        response.text().then(message => alert(`Erro: ${message}`));
      }
    })
    .catch(error => console.error(error));
})


