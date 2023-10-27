from flask import Flask, jsonify, request, send_from_directory, render_template
import json
import os

app = Flask(__name__, template_folder='public')
json_folder = "JSON"

# Rota para login


@app.route('/')
def login():
    with open("./public/Login/index.html") as f:
        return f.read()

# Rota para arquivos estáticos


@app.route('/public/<path:path>')
def public(path):
    return send_from_directory('public', path)

# Rota para a tela do professor


@app.route("/professor")
def tela_professor():
    with open(os.path.join(json_folder, "turmas.json"), "r") as f:
        turmas = json.load(f)

    return render_template('telaProfessor/index.html', turmas=turmas,)


# Inicializa os dados das turmas e alunos
turmas = []
alunos = []
turma_id_counter = 1
aluno_id_counter = 1

with open("JSON/turmas.json") as t:
  turmas = json.load(t)
  if turmas != []:
    max_id = max(item["ID"] for item in turmas)

    if max_id > 0:
      turma_id_counter = max_id + 1

with open ("JSON/alunos.json") as a:
    alunos = json.load(a)
    if alunos != []:
        max_id_a = max(item["ID"] for item in alunos)

        if max_id_a > 0:
            aluno_id_counter = max_id_a + 1

with open ("JSON/turmas.json") as aa:
    add_alunos = json.load(aa)
     

# Rota para adicionar turma


@app.route('/turma', methods=['POST'])
def addTurma():
    data = request.get_json()
    turma_name = data.get("Nome da Turma")
    global turma_id_counter
    turma_id = turma_id_counter
    turma_id_counter += 1
    turma = {
        "ID": turma_id,
        "Nome da Turma": turma_name,
        "Professor": data.get("Professor"),
        "Turno": data.get("Turno"),
        "alunos": [],
        "ciclos": [],
    }


    turmas.append(turma)
    save_data()
    return turma_name

# Rota para obter todas as turmas


@app.route('/turmas/<string:nome>')
def getTurmas(nome):
    search_id_alunos = []
    with open ("JSON/turmas.json") as f:
        load_turmas = json.load(f)
        for turma in load_turmas:
            if turma["Nome da Turma"] == nome:
                search_id_alunos = turma["alunos"]

    with open ("JSON/alunos.json") as a:
        alunos_encontrados = []
        load_alunos = json.load(a)
        for aluno in load_alunos:
            if aluno["ID"] in search_id_alunos:
                alunos_encontrados.append(aluno)
    global turmas

    turma = next((t for t in turmas if t["Nome da Turma"] == nome), None)
    if turma:
        return render_template('teleAlunos/index.html', turma=turma, alunos=alunos_encontrados)

    return jsonify({"Erro": "Turma não encontrada"})


# Rota para adicionar aluno
@app.route('/aluno', methods=['POST'])
def addAluno():
    data = request.get_json()
    global aluno_id_counter
    aluno_id = aluno_id_counter
    aluno_id_counter += 1

    aluno = {
        "ID": aluno_id,
        "Nome do Aluno": data.get("Nome do Aluno"),
        "R.A": data.get("R.A"),
        "turma": data.get("turma")
    }
    alunos.append(aluno)
    save_data()
    
    with open("JSON/turmas.json", "r") as at:
        add_alunos_turmas = json.load(at)

    with open("JSON/turmas.json", "w") as at:
        aluno_em_turma = aluno["turma"] 
        for turma in add_alunos_turmas:
            if turma["Nome da Turma"] == aluno_em_turma:
                turma["alunos"].append(aluno["ID"])
        
        json.dump(add_alunos_turmas, at)

    return data.get("Nome do Aluno")

# Rota para obter todos os alunos


@app.route('/alunos')
def getAlunos():
    return jsonify({"alunos": alunos})

# Função para salvar os dados em arquivos JSON


def save_data():
    with open(os.path.join(json_folder, "turmas.json"), "w") as f:
        json.dump(turmas, f)
    with open(os.path.join(json_folder, "alunos.json"), "w") as f:
        json.dump(alunos, f)


# Roda a API
if __name__ == '__main__':
    # Carrega os dados ao iniciar a aplicação
    if os.path.exists(os.path.join(json_folder, "turmas.json")):
        with open(os.path.join(json_folder, "turmas.json"), "r") as f:
            turmas = json.load(f)
    if os.path.exists(os.path.join(json_folder, "alunos.json")):
        with open(os.path.join(json_folder, "alunos.json"), "r") as f:
            alunos = json.load(f)
    app.run(host='0.0.0.0')
