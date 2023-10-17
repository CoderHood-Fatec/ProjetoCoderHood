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
  const nomeAlunoInput = document.getElementById("nomeAluno");
  const raInput = document.getElementById("ra");
  const turmaInput = document.getElementById("turma");
  const turnoInput = document.getElementById("turno");

  //Pegando os valores inseridos nos inputs
  const nomeAluno = nomeAlunoInput.value;
  const ra = raInput.value;
  const turma = turmaInput.value;
  const turno = turnoInput.value;

  //Criando uma lista de objeto com os dados das turmas
  const dados = {
      "Nome do Aluno": nomeAluno,
      "R.A": ra,
      "Turma": turma,
      "Turno": turno,
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

  const inserirAlunoDiv = document.getElementById("inserirAluno");
  function adicionarAluno(aluno) {
    const alunoDiv = document.createElement("div");

    alunoDiv.classList.add("aluno");
    alunoDiv.innerHTML = `
    <span class="titulo">Nome:</span> ${aluno["Nome do Aluno"]}  
    <span class="titulo">R.A:</span> ${aluno["R.A"]}  
    <span class="titulo">Turma:</span> ${aluno["Turma"]}  
    <span class="titulo">Turno:</span> ${aluno["Turno"]}
  `;

   
    inserirAlunoDiv.appendChild(alunoDiv);
  }

  adicionarAluno(dados);

  // console.log(window.location)

  // //Enviando a requisição POST para o servidor
  // fetch(window.location.origin + '/aluno', option).then(teste => {
  //   teste.text().then(id =>{
  //   //Exibindo a resposta do servidor na página
  //   document.getElementById("inserirAluno").innerHTML+=`<a target="__blank" href="/turmas/${id}">`  +id+'</a>'
  //     console.log(id + "este é o text")
  // })
  // }).catch(e => {
  //     console.log(e);
  //     });

  toggleModal();

  // Limpar os campos de entrada
  nomeAlunoInput.value = "";
  raInput.value = "";
  turmaInput.value = "";
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
