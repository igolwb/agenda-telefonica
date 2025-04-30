import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Componente para adicionar e editar entradas
function TelefoneForm({ aoSalvar, contatoParaEditar, aoCancelarEdicao }) {
  const estadoInicialFormulario = { id: null, nome: '', numero: '', email: '', apelido: '' };
  const [dadosFormulario, setDadosFormulario] = useState(estadoInicialFormulario);
  const [erros, setErros] = useState({});

  const estaEditando = Boolean(contatoParaEditar && contatoParaEditar.id);

  useEffect(() => {
    if (estaEditando) {
      setDadosFormulario({
        id: contatoParaEditar.id,
        nome: contatoParaEditar.nome,
        numero: contatoParaEditar.numero,
        email: contatoParaEditar.email,
        apelido: contatoParaEditar.apelido,
      });
      setErros({});
    } else {
      setDadosFormulario(estadoInicialFormulario);
    }
  }, [contatoParaEditar]);

  const lidarMudanca = (e) => {
    const { name, value } = e.target;
    setDadosFormulario((dadosAnteriores) => ({
      ...dadosAnteriores,
      [name]: value,
    }));
    if (erros[name] && value.trim()) {
      setErros(prev => ({ ...prev, [name]: null }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};
  
    // Validação do campo "nome"
    if (!dadosFormulario.nome.trim()) {
      novosErros.nome = 'O nome é obrigatório';
    }
  
    // Validação do campo "numero"
    if (!dadosFormulario.numero.trim()) {
      novosErros.numero = 'O número de telefone é obrigatório';
    } else if (!/^\+?[0-9\s\-()]+$/.test(dadosFormulario.numero)) {
      novosErros.numero = 'Formato de número de telefone inválido. Use apenas números, espaços, parênteses, traços e o símbolo "+"';
    }
  
    // Validação do campo "email"
    if (!dadosFormulario.email.trim()) {
      novosErros.email = 'O email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dadosFormulario.email)) {
      novosErros.email = 'Formato de email inválido. Exemplo: usuario@dominio.com';
    }
  
    // Validação do campo "apelido"
    if (!dadosFormulario.apelido.trim()) {
      novosErros.apelido = 'O apelido é obrigatório';
    }
  
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const lidarEnvio = (e) => {
    e.preventDefault();
    if (!validarFormulario()) {
      return;
    }
    aoSalvar(dadosFormulario);
    if (!estaEditando) {
      setDadosFormulario(estadoInicialFormulario);
    }
    setErros({});
  };

  const lidarCancelar = () => {
    setDadosFormulario(estadoInicialFormulario);
    setErros({});
    if (estaEditando && aoCancelarEdicao) {
      aoCancelarEdicao();
    }
  };

  return (
    <form onSubmit={lidarEnvio} className="mb-4 p-3 border rounded bg-light">
      <h3 className="mb-3">{estaEditando ? 'Editar Contato' : 'Adicionar Novo Contato'}</h3>
      <div className="mb-3">
        <label htmlFor="nome" className="form-label">Nome:</label>
        <input
          type="text"
          className={`form-control ${erros.nome ? 'is-invalid' : ''}`}
          id="nome"
          name="nome"
          value={dadosFormulario.nome}
          onChange={lidarMudanca}
          required
        />
        {erros.nome && <div className="invalid-feedback">{erros.nome}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="numero" className="form-label">Número de Telefone:</label>
        <input
          type="tel"
          className={`form-control ${erros.numero ? 'is-invalid' : ''}`}
          id="numero"
          name="numero"
          value={dadosFormulario.numero}
          onChange={lidarMudanca}
          required
        />
        {erros.numero && <div className="invalid-feedback">{erros.numero}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email:</label>
        <input
          type="email"
          className={`form-control ${erros.email ? 'is-invalid' : ''}`}
          id="email"
          name="email"
          value={dadosFormulario.email}
          onChange={lidarMudanca}
          required
        />
        {erros.email && <div className="invalid-feedback">{erros.email}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="apelido" className="form-label">Apelido:</label>
        <input
          type="text"
          className={`form-control ${erros.apelido ? 'is-invalid' : ''}`}
          id="apelido"
          name="apelido"
          value={dadosFormulario.apelido}
          onChange={lidarMudanca}
          required
        />
        {erros.apelido && <div className="invalid-feedback">{erros.apelido}</div>}
      </div>
      <div className="d-flex justify-content-end">
        {estaEditando && (
          <button type="button" className="btn btn-secondary me-2" onClick={lidarCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {estaEditando ? 'Atualizar Contato' : 'Adicionar Contato'}
        </button>
      </div>
    </form>
  );
}

export default TelefoneForm;