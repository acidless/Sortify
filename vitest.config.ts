import {coverageConfigDefaults, defineConfig} from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './setupTests.ts',
        coverage: {
            provider: 'v8',
            exclude: [...coverageConfigDefaults.exclude, '*.config.{ts,js}'],
        },
    },
})