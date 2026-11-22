import { SemSessao, Shell, cx, fData, iniciais, lerAluno, sair } from '../lib/sgu';

function Linha({ rotulo, valor, primeira }: { rotulo: string; valor: string; primeira?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 py-3.5 text-[15px] ${primeira ? '' : cx.linha}`}>
      <span className={cx.mudo}>{rotulo}</span>
      <b className="break-all text-right font-semibold">{valor}</b>
    </div>
  );
}

export default function Perfil() {
  const aluno = lerAluno();
  if (!aluno) return <SemSessao />;

  return (
    <Shell aluno={aluno} ativa="perfil">
      <h1 className={cx.titulo}>Perfil</h1>
      <p className={cx.sub}>Dados cadastrais</p>

      <div className="flex flex-col items-center gap-2 pb-1.5 pt-3.5">
        <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#E2EDDC] text-2xl font-bold text-[#14402F] dark:bg-[#24402F] dark:text-[#E6F0EA]">
          {iniciais(aluno.nome)}
        </div>
        <b className="text-xl">{aluno.nome}</b>
      </div>

      <div className={`${cx.card} mt-1.5`}>
        <Linha primeira rotulo="Matrícula" valor={aluno.matricula} />
        <Linha rotulo="E-mail" valor={aluno.email} />
        <Linha rotulo="Curso" valor={aluno.curso} />
        <Linha rotulo="Semestre" valor={`${aluno.semestre}º`} />
        {aluno.createdAt ? <Linha rotulo="Cadastro" valor={fData(aluno.createdAt)} /> : null}
      </div>

      <button type="button" onClick={sair} className={`${cx.pill} mt-[18px] w-full`}>
        Sair da conta
      </button>
    </Shell>
  );
}
