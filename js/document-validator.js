// ============================================================
// Componente de Validação e Máscara de Documento (CPF/CNPJ)
// ============================================================

/**
 * Retorna apenas os dígitos de uma string.
 * @param {string} value - A string com ou sem formatação.
 * @returns {string} - Apenas os números.
 */
function getCleanValue(value) {
  return (value || '').replace(/\D/g, '');
}

/**
 * Valida um CPF usando o algoritmo da Receita Federal.
 * @param {string} cpf - CPF com 11 dígitos.
 * @returns {boolean}
 */
export function validateCPF(cpf) {
  const cleanCPF = getCleanValue(cpf);
  // Rejeita se não tiver 11 dígitos ou se for uma sequência de dígitos repetidos
  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  let digit1 = (remainder === 10 || remainder === 11) ? 0 : remainder;
  if (digit1 !== parseInt(cleanCPF.charAt(9))) {
    return false;
  }
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  let digit2 = (remainder === 10 || remainder === 11) ? 0 : remainder;
  return digit2 === parseInt(cleanCPF.charAt(10));
}

/**
 * Valida um CNPJ usando o algoritmo da Receita Federal.
 * @param {string} cnpj - CNPJ com 14 dígitos.
 * @returns {boolean}
 */
export function validateCNPJ(cnpj) {
  const cleanCNPJ = getCleanValue(cnpj);
  // Rejeita se não tiver 14 dígitos ou se for uma sequência de dígitos repetidos
  if (cleanCNPJ.length !== 14 || /^(\d)\1{13}$/.test(cleanCNPJ)) {
    return false;
  }

  // --- Cálculo do primeiro dígito verificador ---
  let size = 12;
  let numbers = cleanCNPJ.substring(0, size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(cleanCNPJ.charAt(12))) {
    return false;
  }

  // --- Cálculo do segundo dígito verificador ---
  size = 13;
  numbers = cleanCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(cleanCNPJ.charAt(13));
}

/**
 * Aplica a máscara de CPF ou CNPJ dinamicamente.
 * @param {HTMLInputElement} input - O elemento de input.
 */
function maskDocument(input) {
  const cleanValue = getCleanValue(input.value);
  let maskedValue = '';

  if (cleanValue.length <= 11) { // Formato CPF
    for (let i = 0; i < cleanValue.length; i++) {
      if (i === 3 || i === 6) maskedValue += '.';
      else if (i === 9) maskedValue += '-';
      maskedValue += cleanValue[i];
    }
  } else { // Formato CNPJ
    const cnpjValue = cleanValue.substring(0, 14);
    for (let i = 0; i < cnpjValue.length; i++) {
      if (i === 2 || i === 5) maskedValue += '.';
      else if (i === 8) maskedValue += '/';
      else if (i === 12) maskedValue += '-';
      maskedValue += cnpjValue[i];
    }
  }
  input.value = maskedValue;
}

/**
 * Retorna o tipo e o valor limpo do documento.
 * @param {HTMLInputElement} input - O elemento de input.
 * @returns {{type: 'CPF' | 'CNPJ', value: string}}
 */
export function getCleanDocument(input) {
  const value = getCleanValue(input.value);
  return {
    type: value.length > 11 ? 'CNPJ' : 'CPF',
    value: value,
  };
}

/**
 * Inicializa o comportamento de máscara e validação para um campo de documento (CPF/CNPJ).
 * @param {object} options
 * @param {string} options.inputId - O ID do elemento de input.
 * @param {string} options.errorElementId - O ID do elemento de erro.
 * @param {string} [options.labelId] - O ID opcional do label a ser atualizado.
 * @param {string} [options.razaoSocialFieldId] - O ID opcional do campo de Razão Social.
 */
export function initDocumentInput({ inputId, errorElementId, labelId, razaoSocialFieldId }) {
  const docInput = document.getElementById(inputId);
  const errorElement = document.getElementById(errorElementId);
  const labelElement = labelId ? document.getElementById(labelId) : null;
  const razaoSocialField = razaoSocialFieldId ? document.getElementById(razaoSocialFieldId) : null;

  if (!docInput || !errorElement) {
    console.error(`Input ('${inputId}') ou elemento de erro ('${errorElementId}') não encontrado.`);
    return;
  }

  const originalLabelHTML = labelElement ? labelElement.innerHTML : '';

  const handleInput = () => {
    maskDocument(docInput);
    const { type, value } = getCleanDocument(docInput);

    if (labelElement) {
      labelElement.innerHTML = value.length > 0 ? `<i class="fas fa-id-card"></i> ${type}` : originalLabelHTML;
    }
    if (razaoSocialField) {
      razaoSocialField.style.display = type === 'CNPJ' ? 'block' : 'none';
    }
  };

  const handleValidation = () => {
    const { type, value } = getCleanDocument(docInput);
    if (value.length === 0) {
      docInput.classList.remove('input-error');
      errorElement.style.display = 'none';
      return;
    }

    const isComplete = type === 'CPF' ? value.length === 11 : value.length === 14;
    const isValid = isComplete && (type === 'CPF' ? validateCPF(value) : validateCNPJ(value));

    docInput.classList.toggle('input-error', !isValid);
    errorElement.style.display = isValid ? 'none' : 'block';
    errorElement.textContent = isComplete ? `${type} inválido.` : `${type} incompleto.`;
  };

  docInput.addEventListener('input', handleInput);
  docInput.addEventListener('blur', handleValidation);
}