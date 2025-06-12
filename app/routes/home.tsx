import type { Route } from "./+types/home";
import { HomePage } from "../homepage/homepage";

import i18next from '../i18n'


export function meta({}: Route.MetaArgs) {
  return [
    { title: i18next.t('title') },
    { name: "description", content: i18next.t('description') },
  ];
}

export default function Home() {
  return <HomePage />;
}