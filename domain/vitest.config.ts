import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true, // Permite usar 'describe', 'it', 'expect' sin importarlos
    environment: 'node', // Entorno de Node.js
    coverage: {
      provider: 'v8', // Usar el proveedor V8 para cobertura
      reporter: ['text', 'json', 'html'], // Generar reportes en formato texto, JSON y HTML
      include: ['src/**/*.ts'], // Incluir todos los archivos .ts en la cobertura
      exclude: [
        'src/**/*.interface.ts', // Excluir interfaces
        'src/**/*.type.ts', // Excluir tipos
        'src/**/*.dto.ts', // Excluir DTOs
        'src/**/index.ts' // Excluir el archivo index
      ]
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Alias para la raíz del proyecto
      '@domain': resolve(__dirname, './src'), // Alias para la carpeta src/
    },
  },
});