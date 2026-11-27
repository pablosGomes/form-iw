const formulario = document.getElementById('formulario');
const resultado = document.getElementById('resultado');

const campos = ['nome', 'email', 'idade', 'senha', 'confirmaSenha'];

function valor(id) {
  return document.getElementById(id).value.trim();
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// Retorna a mensagem de erro do campo, ou '' se estiver válido.
function validarCampo(id) {
  // Senhas não sofrem trim para respeitar espaços digitados
  const v = (id === 'senha' || id === 'confirmaSenha')
    ? document.getElementById(id).value
    : valor(id);

  if (v === '') return 'Este campo é obrigatório.';

  switch (id) {
    case 'email':
      if (!emailValido(v)) return 'Digite um e-mail válido (ex.: nome@dominio.com).';
      break;
    case 'idade': {
      const n = Number(v);
      if (!/^\d+$/.test(v) || !Number.isInteger(n) || n <= 0) {
        return 'A idade deve ser um número maior que zero.';
      }
      break;
    }
    case 'senha':
      if (v.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
      break;
    case 'confirmaSenha':
      if (v !== document.getElementById('senha').value) {
        return 'A confirmação de senha não confere com a senha.';
      }
      break;
  }
  return '';
}

function mostrarErro(id, mensagem) {
  const input = document.getElementById(id);
  document.getElementById('erro-' + id).textContent = mensagem;
  input.classList.toggle('invalido', mensagem !== '');
  input.classList.toggle('valido', mensagem === '');
}

function mostrarResultado(tipo, texto) {
  resultado.hidden = false;
  resultado.className = 'resultado ' + tipo;
  resultado.textContent = texto;
}

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();

  let temErro = false;
  campos.forEach(function (id) {
    const msg = validarCampo(id);
    mostrarErro(id, msg);
    if (msg) temErro = true;
  });

  if (temErro) {
    // Impede o envio e avisa o usuário
    mostrarResultado('falha', 'Corrija os erros destacados antes de enviar.');
    return;
  }

  mostrarResultado('sucesso', 'Dados preenchidos corretamente!');
  formulario.reset();
  campos.forEach(function (id) {
    const input = document.getElementById(id);
    input.classList.remove('valido', 'invalido');
  });
});

// Validação em tempo real ao sair do campo
campos.forEach(function (id) {
  document.getElementById(id).addEventListener('blur', function () {
    mostrarErro(id, validarCampo(id));
  });
});
