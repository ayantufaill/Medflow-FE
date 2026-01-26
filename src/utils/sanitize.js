export const sanitizeHTML = (text) => {
  if (!text) return text;
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = text;
  
  const scripts = tempDiv.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  const styles = tempDiv.querySelectorAll('style');
  styles.forEach(style => style.remove());
  
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(element => {
    const attributes = Array.from(element.attributes);
    attributes.forEach(attr => {
      if (attr.name.startsWith('on') || attr.name === 'style') {
        element.removeAttribute(attr.name);
      }
    });
  });
  
  return tempDiv.textContent || tempDiv.innerText || '';
};

export const sanitizeSOAPFields = (data) => {
  const sanitizeField = (value) => {
    const sanitized = sanitizeHTML(value);
    return sanitized && sanitized.trim() ? sanitized : undefined;
  };

  return {
    ...data,
    subjective: sanitizeField(data.subjective),
    objective: sanitizeField(data.objective),
    assessment: sanitizeField(data.assessment),
    plan: sanitizeField(data.plan),
    chiefComplaint: sanitizeField(data.chiefComplaint),
    historyOfPresentIllness: sanitizeField(data.historyOfPresentIllness),
    physicalExam: sanitizeField(data.physicalExam),
  };
};
