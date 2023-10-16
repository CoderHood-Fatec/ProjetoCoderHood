from flask import Flask, jsonify, request, send_from_directory
from flask.templating import render_template

#Criando instância Flask
app = Flask(__name__, template_folder='public')


# Rota para página inicial
@app.route('/teste')
def homepage():
  return 'A API está no ar'


#Lista para armazenar informações das turmas
turmas = []


#Rota para adicionar turma
@app.route('/turma', methods=['POST'])
def addTurma():
  global turmas
  turmas.append(request.get_json())
  return request.get_json()["Nome da Turma"]


#Rota para login
@app.route('/')
def login():
  with open("./public/Login/index.html") as f:
    return f.read()


#Rota para arquivos estáticos
@app.route('/public/<path:path>')
def public(path):
  return send_from_directory('public', path)


# Pegando os 'ids' das turmas por string
@app.route('/turmas/<string:nome>')
def getTurmas(nome):
  global turmas
  for turma in turmas:
    if turma["Nome da Turma"] == nome:
      return render_template('teleAlunos/index.html', turma=turma)
  return jsonify({"Erro": "Turma não encontrada"})


# Rota para página do aluno pela id
@app.route('/aluno/<int:id>')
def aluno(id):
  return str(id)


# Roda a nossa API
if __name__ == '__main__':
  app.run(host='0.0.0.0')
