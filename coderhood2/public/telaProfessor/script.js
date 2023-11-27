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
    teste.text().then(id =>{
    //Exibindo a resposta do servidor na página
    document.getElementById("inserirTurma").innerHTML+=`<a class=turma href="/turmas/${id}">` + " " +id+'</a>'
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

//Recebendo os dados inseridos no cadastrar turmas
function enviarDadosAluno() {
  // Referências dos elementos inseridos
  const nomeAlunoInput = document.getElementById("nomeAluno");
  const raInput = document.getElementById("ra");
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  // Pegando os valores inseridos nos inputs
  const nomeAluno = nomeAlunoInput.value;
  const ra = raInput.value;
  const turmasSelecionadas = [];

  checkboxes.forEach(checkbox => {
      turmasSelecionadas.push(checkbox.value);
      console.log(turmasSelecionadas)
  });

  // Criando um objeto com os dados do aluno, incluindo as turmas selecionadas
  const dados = {
      "Nome do Aluno": nomeAluno,
      "R.A": ra,
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

  // Função para excluir turma
function excluirTurma(nomeTurma) {
  const confirmacao = confirm(`Tem certeza que deseja excluir a turma '${nomeTurma}'?`);
  if (confirmacao) {
      // Envia uma requisição para o servidor para excluir a turma
      fetch(window.location.origin + '/excluir-turma', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nomeTurma }),
      })
      .then(response => response.text())
      .then(result => {
          // Atualiza a página ou realiza ações adicionais, se necessário
          window.location.reload();
      })
      .catch(error => console.error('Erro ao excluir turma:', error));
  }
}

// Função para apagar turma
function apagarTurma(nomeTurma) {
  const confirmacao = confirm(`Tem certeza que deseja apagar a turma '${nomeTurma}'? Isso excluirá permanentemente a turma e todos os dados relacionados.`);
  if (confirmacao) {
      // Envia uma requisição para o servidor para apagar a turma
      fetch(window.location.origin + '/apagar-turma', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nomeTurma }),
      })
      .then(response => response.text())
      .then(result => {
          // Atualiza a página ou realiza ações adicionais, se necessário
          window.location.reload();
      })
      .catch(error => console.error('Erro ao apagar turma:', error));
  }
}
}

/* //Carregar turmas para selecionar em qual turma o aluno irá fazer parte

function carregarTurmas() {
  fetch('/turmas')
      .then(response => response.json())
      .then(data => {
          const turmasDiv = document.getElementById('turmas');

          // Preencher o div com as checkboxes das turmas do arquivo turmas.json
          data.forEach(turma => {
              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.name = 'turma'; // Define um nome para o grupo de checkboxes
              checkbox.value = turma['Nome da Turma'];
              checkbox.id = `turma_${turma['ID']}`; // Define um ID exclusivo para cada checkbox

              const label = document.createElement('label');
              label.htmlFor = `turma_${turma['ID']}`;
              label.appendChild(document.createTextNode(turma['Nome da Turma']));

              turmasDiv.appendChild(checkbox);
              turmasDiv.appendChild(label);
              turmasDiv.appendChild(document.createElement('br')); // Adicione uma quebra de linha
          });
      })
      .catch(error => {
          console.error('Erro ao carregar turmas:', error);
      });
}

// Chame a função carregarTurmas para preencher o div de checkboxes quando a página for carregada
window.addEventListener('load', carregarTurmas); */

