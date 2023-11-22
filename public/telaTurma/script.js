//Atividades do modal
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("modal");
const fade = document.getElementById("fade");

const toggleModal = () => {
  modal.classList.toggle("hide");
  fade.classList.toggle("hide");
};

[openModalBtn, closeModalBtn, fade].forEach((el) => {
  el.addEventListener("click", () => toggleModal());
});

//Recebendo os dados inseridos no cadastrar turmas
function enviarDados() {
  const nomeAlunoInput = document.getElementById("nomeAluno");
  const raInput = document.getElementById("ra");
  const turmaInput = document.getElementById("turma");
  const turnoInput = document.getElementById("turno");

  const nomeAluno = nomeAlunoInput.value;
  const ra = raInput.value;
  const turma = turmaInput.value;
  const turno = turnoInput.value;

  const dados = [
    {
      "Nome do Aluno": nomeAluno,
      ra: ra,
      turma: turma,
      Turno: turno,
    },
  ];
  
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
  fetch(window.location.origin + '/aluno', option).then(teste => {
    teste.text().then(id =>{
    //Exibindo a resposta do servidor na página
    document.getElementById("inserirAluno").innerHTML+=`<a target="__blank" href="/turmas/${id}">`  +id+'</a>'
      console.log(id + "este é o text")
  })
  }).catch(e => {
      console.log(e);
      });

  toggleModal();

  // Limpar os campos de entrada
  nomeAlunoInput.value = "";
  raInput.value = "";
  turmaInput.value = "";
  turnoInput.value = "";
}

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      enviarDados();
    }
  });
});
