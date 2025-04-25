import React, { useState, useEffect } from 'react';

// Componente para adicionar e editar entradas
function TeleformForm({ aoSalvar, contatoParaEditar, aoCancelarEdicao }) {
  // Estado inicial do formulário traduzido
  const estadoInicialFormulario = { id: null, nome: '', numero: '' };
  const [dadosFormulario, setDadosFormulario] = useState(estadoInicialFormulario);
  const [erros, setErros] = useState({});

  // Verifica se está em modo de edição
  const estaEditando = Boolean(contatoParaEditar && contatoParaEditar.id);

  // Efeito para preencher o formulário quando contatoParaEditar muda
  useEffect(() => {
    if (estaEditando) {
      setDadosFormulario({
        id: contatoParaEditar.id,
        nome: contatoParaEditar.nome,     // Changed from name
        numero: contatoParaEditar.numero, // Changed from number
      });
      setErros({}); // Limpa erros ao iniciar uma edição
    } else {
      setDadosFormulario(estadoInicialFormulario); // Reseta o formulário se não estiver editando
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contatoParaEditar]); // Roda novamente apenas quando contatoParaEditar muda


  // Lida com mudanças nos inputs
  const lidarMudanca = (e) => {
    const { name, value } = e.target;
    setDadosFormulario((dadosAnteriores) => ({
      ...dadosAnteriores,
      [name]: value,
    }));
    // Feedback básico de validação em tempo real (opcional)
    if (erros[name] && value.trim()) {
        setErros(prev => ({...prev, [name]: null}));
    }
  };

  // Valida o formulário
  const validarFormulario = () => {
      const novosErros = {};
      // Campos traduzidos aqui (nome, numero)
      if (!dadosFormulario.nome.trim()) novosErros.nome = 'O nome é obrigatório';
      // Verificação simples do formato do número de telefone (permite dígitos, espaços, -, (, ), +)
      if (!dadosFormulario.numero.trim()) {
          novosErros.numero = 'O número de telefone é obrigatório';
      } else if (!/^[+\d()-\s]+$/.test(dadosFormulario.numero)) {
          novosErros.numero = 'Formato de número de telefone inválido';
      }
      setErros(novosErros);
      return Object.keys(novosErros).length === 0; // True se não houver erros
  }

  // Lida com o envio do formulário
  const lidarEnvio = (e) => {
    e.preventDefault(); // Previne o recarregamento padrão da página do formulário
    if (!validarFormulario()) {
        return; // Não envia se a validação falhar
    }
    // Passa os dados do formulário atual (incluindo id se estiver editando)
    // Note que os campos dentro de dadosFormulario agora são 'nome' e 'numero'
    aoSalvar(dadosFormulario);
    if (!estaEditando) {
        setDadosFormulario(estadoInicialFormulario); // Limpa o formulário apenas após ADICIONAR com sucesso
    }
    setErros({}); // Limpa erros ao salvar com sucesso
  };

  // Lida com o cancelamento (seja da edição ou do preenchimento)
  const lidarCancelar = () => {
      setDadosFormulario(estadoInicialFormulario);
      setErros({});
      if (estaEditando && aoCancelarEdicao) {
          aoCancelarEdicao(); // Sinaliza ao App para limpar o estado de edição
      }
  }

  return (
    <form onSubmit={lidarEnvio} className="mb-4 p-3 border rounded bg-light">
      <h3 className="mb-3">{estaEditando ? 'Editar Contato' : 'Adicionar Novo Contato'}</h3>
      <div className="mb-3">
        {/* Label e input para Nome */}
        <label htmlFor="nome" className="form-label">Nome:</label>
        <input
          type="text"
          className={`form-control ${erros.nome ? 'is-invalid' : ''}`}
          id="nome"        // id corresponde ao htmlFor e ao nome do estado
          name="nome"       // name corresponde à chave no estado dadosFormulario
          value={dadosFormulario.nome}
          onChange={lidarMudanca}
          required // Validação básica HTML5
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
export default TeleformForm;