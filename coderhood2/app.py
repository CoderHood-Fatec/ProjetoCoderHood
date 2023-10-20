from math import log
import os
from flask import Flask, jsonify, request, send_from_directory
from flask.templating import render_template
import json
#Criando instância Flask
app = Flask(__name__, template_folder='public')


# Rota para página inicial
@app.route('/teste')
def homepage():
  return 'A API está no ar'


#Rota para adicionar turma
@app.route('/turma', methods=['POST'])
def addTurma():
  with open("JSON/" + request.get_json()["Nome da Turma"] + ".json", "w") as f:
    json.dump(request.get_json(),f)

  return request.get_json()["Nome da Turma"]# Pegando os 'ids' das turmas por string

@app.route('/turmas/<string:nome>')
def getTurmas(nome):
  global turmas

  with open("JSON/" + nome + ".json") as f:
    turma = json.load(f)
    print(turma["Nome da Turma"])
    if turma:
      return render_template('teleAlunos/index.html', turma=turma)

      
  return jsonify({"Erro": "Turma não encontrada"})


#Rota para login
@app.route('/')
def login():
  with open("./public/Login/index.html") as f:
    return f.read()


#Rota para arquivos estáticos
@app.route('/public/<path:path>')
def public(path):
  return send_from_directory('public', path)


@app.route("/professor")
def tela_professor():
  turmas = os.listdir("JSON")

  for i in range(len(turmas)):
    turmas[i] = turmas[i].removesuffix(".json")

  return render_template('telaProfessor/index.html', turmas=turmas)

# Rota para página do aluno pela id
alunos = []


@app.route('/aluno', methods=['POST'])
def addAluno():
  global alunos
  turma = None
  with open("JSON/" + request.get_json()["Turma"] + ".json", "r") as f:
    turma = json.load(f)

  with open("JSON/" + request.get_json()["Turma"] + ".json", "w") as fw:
    turma["Alunos"].append(request.get_json())
    json.dump(turma, fw)


  return request.get_json()["Nome do Aluno"]


# Roda a nossa API
if __name__ == '__main__':
  app.run(host='0.0.0.0')
