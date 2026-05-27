"use client";

export default function Hero() {
  return (
    <section id="hero" className="relative isolate overflow-hidden bg-gray-900 ">
   
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-pink-500 to-indigo-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
        />
      </div>


      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        {/* Badge */}
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="rounded-full px-4 py-1.5 text-sm text-gray-300 ring-1 ring-white/10 hover:ring-white/20 transition">
            📚 Junte-se à comunidade de Páginas compartilhadas e compartilhe conhecimento
          </div>
        </div>

 
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
            Compartilhe livros.
            <br />
            Inspire pessoas.
          </h1>

    
          <p className="mt-8 text-lg leading-8 text-gray-300 sm:text-xl">
            Doe, troque e descubra novos livros em uma comunidade criada para
            conectar leitores apaixonados por conhecimento e aprendizado.
          </p>


          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Explorar Livros
            </a>

            <a
              href="#"
              className="text-sm font-semibold text-white transition hover:text-indigo-300"
            >
              Doar um livro <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>


      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-pink-500 to-indigo-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72rem]"
        />
      </div>
    </section>
  );
}