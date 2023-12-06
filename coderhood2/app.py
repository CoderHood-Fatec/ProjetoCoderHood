from flask import Flask, jsonify, request, send_from_directory, render_template
import json
import os

app = Flask(__name__, template_folder='public')
json_folder = "JSON"
app.config['DEBUG'] = True
app.config['TEMPLATES_AUTO_RELOAD'] = True

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
ciclo_id_counter = 1

with open("JSON/turmas.json") as t:
    turmas = json.load(t)
    if turmas != []:
        max_id = max(item["ID"] for item in turmas)
        max_id_ciclo = 0
        for turma in turmas:
            if turma["ciclos"] == []:
                continue
            actual_max_id = max(item["id"] for item in turma["ciclos"])
            if actual_max_id > max_id_ciclo:
                max_id_ciclo = actual_max_id
        ciclo_id_counter = max_id_ciclo + 1

        if max_id > 0:
            turma_id_counter = max_id + 1
            

with open("JSON/alunos.json") as a:
    alunos = json.load(a)
    if alunos != []:
        max_id_a = max(item["ID"] for item in alunos)

        if max_id_a > 0:
            aluno_id_counter = max_id_a + 1

with open("JSON/turmas.json") as aa:
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

# Carregue os dados das turmas apenas uma vez ao iniciar o aplicativo
def load_turmas():
    if os.path.exists(os.path.join(json_folder, "turmas.json")):
        with open(os.path.join(json_folder, "turmas.json"), "r") as f:
            return json.load(f)
    return []

turmas = load_turmas()


# Rota para obter todas as turmas

from typing import List, Optional

def find_aluno(aluno_id: int) -> Optional[dict]:
    for aluno in alunos:
        if aluno["ID"] == aluno_id:
            return aluno
    return None

@app.route('/turmas/<string:nome>')
def getTurmas(nome):
    search_id_alunos = []
    with open("JSON/turmas.json") as f:
        load_turmas = json.load(f)
        for turma in load_turmas:
            if turma["Nome da Turma"] == nome:
                search_id_alunos = turma["alunos"]

    with open("JSON/alunos.json") as a:
        alunos_encontrados = []
        load_alunos = json.load(a)
        for aluno in load_alunos:
            if aluno["ID"] in search_id_alunos:
                alunos_encontrados.append(aluno)
    global turmas

    turma = next((t for t in turmas if t["Nome da Turma"] == nome), None)
    if turma:
        media = {}
        total_peso = 0  # Inicializa o total do peso
        for aluno_id in turma["alunos"]:
            aluno = find_aluno(aluno_id)
            if not aluno or len(aluno["Notas"].values()) == 0:
                continue
            notas = aluno["Notas"]
            peso = aluno.get("Peso", 1)  # Obtém o peso do aluno ou usa um peso padrão
            total_peso += peso  # Adiciona o peso ao total_peso
            media[aluno_id] = sum(notas.values()) / len(notas.values())  # Média simples
            if total_peso != 0:
                for aluno_id in media:
                    media[aluno_id] *= peso / total_peso  # Multiplica a média pelo peso relativo
        return render_template('teleAlunos/index.html', turma=turma, alunos=alunos_encontrados, media=media)

    return jsonify({"Erro": "Turma não encontrada"})

@app.route('/ciclo', methods=['POST'])
def addCiclo():
    """
    Request: 
    {
        "periodo_inicio": "2021-01-01",
        "periodo_fim": "2021-12-31",
        "turma": "Turma 1"
    }
    """
    data = request.get_json()
    periodo_inicio = data.get("periodo_inicio")
    periodo_fim = data.get("periodo_fim")
    global ciclo_id_counter
    ciclo_id = ciclo_id_counter
    ciclo_id_counter += 1

    global turmas

    ciclo = {
        "periodo_inicio": periodo_inicio,
        "periodo_fim": periodo_fim,
        "id": ciclo_id
    }

    # Encontra a turma e adiciona o ciclo
    turma = next((t for t in turmas if t["Nome da Turma"] == data.get("turma")), None)
    if turma:
        turma["ciclos"].append(ciclo)

    
        
    save_data()
    return jsonify({"periodo_inicio": periodo_inicio, "periodo_fim": periodo_fim, "id": ciclo_id})

@app.route('/ciclos/<int:id>')
def cicloAlunos(id):
    ciclo = next((c for t in turmas for c in t["ciclos"] if c["id"] == id), None)
    if ciclo:
        alunos_ciclo = []
        turma = next((t for t in turmas if  ciclo in t["ciclos"]), None)
        if not turma:
            return jsonify({"Erro": "Ciclo não encontrado"})
        alunos_ciclo += [get_aluno_by_id(aluno) for aluno in turma["alunos"] if get_aluno_by_id(aluno)]
        
        return render_template('telaCiclos/index.html', alunos_ciclo=alunos_ciclo, turma=turma, ciclo_id=id)
    else:
        return jsonify({"Erro": "Ciclo não encontrado"})

def get_aluno_by_id(id):
    for aluno in alunos:
        if aluno["ID"] == id:
            return aluno
    raise ValueError("Aluno não encontrado")

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
        "turma": [int(turma_id) for turma_id in data.get("turmas")],
        "Notas": {}
    }
    alunos.append(aluno)
    save_data()

    # Adicione o aluno às turmas existentes sem sobrescrever o arquivo JSON
    for turma in turmas:
        if turma["ID"] in aluno["turma"]:
            if aluno_id not in turma["alunos"]:
                turma["alunos"].append(aluno_id)

    with open(os.path.join(json_folder, "turmas.json"), "w") as f:
        json.dump(turmas, f)
    with open("JSON/turmas.json", "r") as at:
        turmas_json = json.load(at)

    with open("JSON/turmas.json", "w") as at:
        turma_do_aluno = aluno["turma"]
        for turma in turmas_json:
            if turma["Nome da Turma"] == turma_do_aluno:
                turma["alunos"].append(aluno["ID"])

        json.dump(turmas_json, at)

    return data.get("Nome do Aluno")


# @app.route('/aluno/<int:id>', methods=['DELETE'])
# def deleteAluno(id):
#     global alunos
#     aluno = next((a for a in alunos if a["ID"] == id), None)
#     if aluno is None:
#         return jsonify({"Erro": "Aluno não encontrado"}), 404
#     alunos.remove(aluno)
#     save_data()
#     return jsonify({"Mensagem": "Aluno excluído com sucesso"}), 200

# def save_data():
#     with open(os.path.join(json_folder, "alunos.json"), "w") as f:
#         for turma in turmas:
#             turma["alunos"] = [aluno for aluno in turma["alunos"] if aluno not in [a["ID"] for a in alunos]]
#         json.dump(turmas, f)
#     with open(os.path.join(json_folder, "alunos.json"), "w") as f:
#         json.dump(alunos, f)

@app.route('/aluno/notas', methods=['POST'])
def saveNotas():
    data = request.get_json()
    aluno_id = data.get('aluno_id')
    ciclo_id = data.get('ciclo_id')
    notas = data.get('notas')

    for i, aluno in enumerate(alunos):
        if aluno['R.A'] == str(aluno_id):
            alunos[i]['Notas'][ciclo_id] = notas
            break
    save_data()

    return jsonify({"Mensagem": "Notas salvas com sucesso."})


# Rota para obter todos os alunos

@app.route('/alunos')
def getAlunos():
    return jsonify({"alunos": alunos})

# @app.route('/aluno/<int:id>', methods=['GET'])
# def obterAluno(id):
#     if os.path.exists(os.path.join(json_folder, "alunos.json")):
#         with open(os.path.join(json_folder, "alunos.json"), "r") as f:
#             alunos = json.load(f)

#             return jsonify(alunos[id])
    



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
