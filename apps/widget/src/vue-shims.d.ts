declare module '*.vue' {
  import { defineComponent } from 'vue';
  const component: ReturnType<typeof defineComponent>;
  export default component;
}

declare module '*.css?inline&asset' {
  const content: string;
  export default content;
}
