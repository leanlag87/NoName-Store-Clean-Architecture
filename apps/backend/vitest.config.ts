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
        'src/**/index.ts', // Excluir el archivo index
        'src/config/**', // Excluir archivos de configuración
        'src/routes/**' // Excluir rutas (solo testear lógica de negocio)
      ]
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Alias para la raíz del backend
      '@domain': resolve(__dirname, '../../domain/src'), // Alias para el domain
      '@backend': resolve(__dirname, './src'), // Alias para el backend
    },
  },
});