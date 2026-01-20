
// Minimal quiz engine
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.quiz').forEach(q => {
    q.querySelectorAll('.check').forEach(btn => btn.addEventListener('click', () => checkQuiz(q)));
  });
});
function checkQuiz(quizEl){
  let score=0, total=0;
  quizEl.querySelectorAll('.q').forEach(q => {
    total++;
    const qid = q.dataset.qid;
    const good = (q.dataset.answer||'').trim().toUpperCase();
    const checked = q.querySelector(`input[name="${qid}"]:checked`);
    const fb = q.querySelector('.feedback');
    if(!checked){ fb.textContent='Choisis une réponse.'; fb.className='feedback ko'; return; }
    if((checked.value||'').trim().toUpperCase()===good){ score++; fb.textContent='✔ Correct'; fb.className='feedback ok'; }
    else { fb.textContent=`✘ Incorrect (bonne réponse : ${good})`; fb.className='feedback ko'; }
  });
  const g = quizEl.querySelector('.score'); if(g) g.textContent = `Score : ${score} / ${total}`;
}
