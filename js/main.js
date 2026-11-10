// Pulso Gym - interacciones
document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* 1. Menú adaptable */
  const toggle = $("#menuToggle"), nav = $("#menuPrincipal");
  const setMenu = (abierto) => {
    nav.classList.toggle("open", abierto);
    toggle.setAttribute("aria-expanded", String(abierto));
    toggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $$("a", nav).forEach(a => a.addEventListener("click", () => setMenu(false)));

  /* 2. Preguntas frecuentes (acordeón) */
  $$(".acc-btn").forEach(btn => btn.addEventListener("click", () => {
    const abierto = btn.closest(".acc-item").classList.toggle("open");
    btn.setAttribute("aria-expanded", String(abierto));
  }));

  /* 3. Filtro de clases */
  $$("[data-filter]").forEach(chip => chip.addEventListener("click", () => {
    $$("[data-filter]").forEach(c => c.classList.toggle("active", c === chip));
    $$("#listaClases .card").forEach(card =>
      card.classList.toggle("hidden", chip.dataset.filter !== "todas" && card.dataset.cat !== chip.dataset.filter));
  }));

  /* 4. Planes: precio mensual / trimestral */
  const cop = n => "$" + Math.round(n).toLocaleString("es-CO");
  $$("[data-periodo]").forEach(chip => chip.addEventListener("click", () => {
    $$("[data-periodo]").forEach(c => c.classList.toggle("active", c === chip));
    const f = chip.dataset.periodo === "trimestral" ? 0.9 : 1;
    $$(".price").forEach(p => p.innerHTML = `${cop(p.dataset.mensual * f)}<small>/mes</small>`);
  }));

  /* 5. Elegir plan -> preselecciona en el formulario */
  $$("[data-plan]").forEach(a => a.addEventListener("click", () => { $("#plan").value = a.dataset.plan; }));

  /* Validación genérica */
  const validar = (campo) => {
    const wrap = campo.closest(".field"), msg = $(".error", wrap);
    let t = "";
    if (!String(campo.value).trim()) t = "Este campo es obligatorio.";
    else if (campo.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value)) t = "Ingresa un correo válido.";
    else if (campo.type === "number" && (+campo.value < +campo.min || +campo.value > +campo.max)) t = `Ingresa un valor entre ${campo.min} y ${campo.max}.`;
    msg.textContent = t; wrap.classList.toggle("invalid", Boolean(t));
    return !t;
  };
  const conectar = (form, alEnviar) => {
    const campos = $$("input, select", form);
    campos.forEach(c => c.addEventListener("blur", () => validar(c)));
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (campos.map(validar).every(Boolean)) alEnviar(); else if ($(".form-ok", form)) $(".form-ok", form).textContent = "";
    });
  };

  /* 6. Formulario de inscripción */
  const formIns = $("#formContacto");
  conectar(formIns, () => {
    $("#formOk").textContent = "¡Gracias! Tu inscripción fue recibida (simulación).";
    formIns.reset();
  });

  /* 7. Calculadora de IMC */
  conectar($("#formImc"), () => {
    const kg = +$("#peso").value, m = +$("#altura").value / 100;
    const imc = kg / (m * m);
    let cat, plan;
    if (imc < 18.5) [cat, plan] = ["Bajo peso", "Plus (clases de fuerza y asesoría)"];
    else if (imc < 25) [cat, plan] = ["Peso normal", "Básico o Plus, según tu rutina"];
    else if (imc < 30) [cat, plan] = ["Sobrepeso", "Plus (incluye clases de cardio)"];
    else [cat, plan] = ["Obesidad", "Premium (entrenador personal)"];
    $("#imcResultado").innerHTML = `<strong>${imc.toFixed(1)}</strong><p><b>${cat}</b></p><p class="hint">Plan sugerido: ${plan}. Es una orientación general, no un diagnóstico.</p>`;
  });
});
