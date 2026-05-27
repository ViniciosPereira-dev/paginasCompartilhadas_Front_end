import {
  BookOpenIcon,
  UsersIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Compartilhe livros",
    description:
      "Doe ou disponibilize livros para outros leitores da comunidade.",
    icon: BookOpenIcon,
  },
  {
    name: "Conecte leitores",
    description:
      "Encontre pessoas com interesses semelhantes e descubra novas leituras.",
    icon: UsersIcon,
  },
  {
    name: "Promova a reutilização",
    description:
      "Dê uma nova vida aos livros que estão parados na sua estante.",
    icon: ArrowPathIcon,
  },
];

export default function AboutUs() {
  return (
    <section
      id="sobre"
      className="bg-white py-24 sm:py-32 dark:bg-gray-900 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-indigo-600">
            Sobre Nós
          </h2>

          <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Compartilhando conhecimento através da leitura
          </p>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            O Páginas Compartilhadas nasceu para conectar leitores,
            incentivar a circulação de livros e tornar o acesso ao
            conhecimento mais simples e acessível para todos.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <dl className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="rounded-2xl bg-gray-50 p-8 dark:bg-white/5"
              >
                <feature.icon
                  className="h-8 w-8 text-indigo-600"
                  aria-hidden="true"
                />

                <dt className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.name}
                </dt>

                <dd className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}