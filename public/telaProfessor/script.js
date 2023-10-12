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
  const nomeTurmaInput = document.getElementById("nomeTurma");
  const professorInput = document.getElementById("professor");
  const turnoInput = document.getElementById("turno");

  const nomeTurma = nomeTurmaInput.value;
  const professor = professorInput.value;
  const turno = turnoInput.value;

  const dados = [
    {
      "Nome da Turma": nomeTurma,
      Professor: professor,
      Turno: turno,
    },
  ];

  console.log(dados);

  toggleModal();

  // Limpar os campos de entrada
  nomeTurmaInput.value = "";
  professorInput.value = "";
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
