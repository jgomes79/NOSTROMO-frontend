// vite.config.ts
import removeAttr from "file:///Users/german/Development/qubic/NOSTROMO-frontend/node_modules/react-remove-attr/dist/remove-attributes.js";
import path from "node:path";
import react from "file:///Users/german/Development/qubic/NOSTROMO-frontend/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { loadEnv } from "file:///Users/german/Development/qubic/NOSTROMO-frontend/node_modules/vite/dist/node/index.js";
import checker from "file:///Users/german/Development/qubic/NOSTROMO-frontend/node_modules/vite-plugin-checker/dist/esm/main.js";
import svgr from "file:///Users/german/Development/qubic/NOSTROMO-frontend/node_modules/vite-plugin-svgr/dist/index.js";
import { defineConfig } from "file:///Users/german/Development/qubic/NOSTROMO-frontend/node_modules/vitest/dist/config.js";
var __vite_injected_original_dirname = "/Users/german/Development/qubic/NOSTROMO-frontend";
var vite_config_default = defineConfig(({ mode }) => {
  process.env.NODE_ENV = mode;
  const inProdMode = mode === "production";
  const env = loadEnv(mode, process.cwd(), "");
  Object.keys(env).forEach((key) => {
    if (key.startsWith("VITE_")) {
      process.env[key] = env[key];
    }
  });
  return {
    plugins: [
      checker({
        typescript: true
      }),
      inProdMode && removeAttr({
        extensions: ["tsx"],
        attributes: ["data-testid"]
      }),
      react(),
      svgr({
        svgrOptions: { exportType: "default", ref: true, svgo: false, titleProp: true },
        include: "**/*.svg"
      })
    ],
    build: {
      sourcemap: !inProdMode,
      reportCompressedSize: false
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "src"),
        "#": path.resolve(__vite_injected_original_dirname, "test")
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/shared/theme.scss";`
        }
      }
    },
    server: {
      port: 4200
    },
    test: {
      globals: true,
      environment: "jsdom",
      environmentOptions: {
        url: "http://localhost"
      },
      include: ["**/*.test.js", "**/*.test.ts", "**/*.test.jsx", "**/*.test.tsx"],
      exclude: ["**/node_modules/**"],
      setupFiles: path.resolve(__vite_injected_original_dirname, "vitest.setup.ts"),
      reporters: ["default", "json", "vitest-sonar-reporter"],
      outputFile: {
        json: "reports/test-report/test-report.json",
        html: "reports/test-report/test-report.html",
        "vitest-sonar-reporter": "reports/vite-sonar/sonar-report.xml"
      },
      coverage: {
        provider: "v8",
        include: ["src/**/*"],
        exclude: ["src/main.tsx", "src/mock-server/**/*", "*.test.*", "*/__mocks__/*"],
        reporter: ["text", "html", "lcov"],
        reportsDirectory: "reports/vite-coverage",
        enabled: false
      },
      clearMocks: true,
      mockReset: true,
      restoreMocks: true,
      unstubGlobals: true,
      unstubEnvs: true
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ2VybWFuL0RldmVsb3BtZW50L3F1YmljL05PU1RST01PLWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZ2VybWFuL0RldmVsb3BtZW50L3F1YmljL05PU1RST01PLWZyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9nZXJtYW4vRGV2ZWxvcG1lbnQvcXViaWMvTk9TVFJPTU8tZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVtb3ZlQXR0ciBmcm9tIFwicmVhY3QtcmVtb3ZlLWF0dHJcIjtcblxuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHsgbG9hZEVudiB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgY2hlY2tlciBmcm9tIFwidml0ZS1wbHVnaW4tY2hlY2tlclwiO1xuaW1wb3J0IHN2Z3IgZnJvbSBcInZpdGUtcGx1Z2luLXN2Z3JcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlc3QvY29uZmlnXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPSBtb2RlOyAvLyBNYWtlIHN1cmUgTk9ERV9FTlYgbWF0Y2hlcyBtb2RlIHdoZW4gYnVpbGRpbmdcblxuICBjb25zdCBpblByb2RNb2RlID0gbW9kZSA9PT0gXCJwcm9kdWN0aW9uXCI7XG5cbiAgLy8gZXhwb3NlIC5lbnYgdmFycyB0byBzZXJ2ZXIgZW52aXJvbm1lbnQgKG9ubHkgVklURV8gcHJlZml4ZWQgdmFycylcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCBcIlwiKTtcbiAgT2JqZWN0LmtleXMoZW52KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoXCJWSVRFX1wiKSkge1xuICAgICAgcHJvY2Vzcy5lbnZba2V5XSA9IGVudltrZXldO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICBjaGVja2VyKHtcbiAgICAgICAgdHlwZXNjcmlwdDogdHJ1ZSxcbiAgICAgIH0pLFxuICAgICAgaW5Qcm9kTW9kZSAmJlxuICAgICAgICByZW1vdmVBdHRyKHtcbiAgICAgICAgICBleHRlbnNpb25zOiBbXCJ0c3hcIl0sXG4gICAgICAgICAgYXR0cmlidXRlczogW1wiZGF0YS10ZXN0aWRcIl0sXG4gICAgICAgIH0pLFxuICAgICAgcmVhY3QoKSxcbiAgICAgIHN2Z3Ioe1xuICAgICAgICBzdmdyT3B0aW9uczogeyBleHBvcnRUeXBlOiBcImRlZmF1bHRcIiwgcmVmOiB0cnVlLCBzdmdvOiBmYWxzZSwgdGl0bGVQcm9wOiB0cnVlIH0sXG4gICAgICAgIGluY2x1ZGU6IFwiKiovKi5zdmdcIixcbiAgICAgIH0pLFxuICAgIF0sXG5cbiAgICBidWlsZDoge1xuICAgICAgc291cmNlbWFwOiAhaW5Qcm9kTW9kZSxcbiAgICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZSxcbiAgICB9LFxuXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpLFxuICAgICAgICBcIiNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJ0ZXN0XCIpLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgY3NzOiB7XG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEBpbXBvcnQgXCJAL3NoYXJlZC90aGVtZS5zY3NzXCI7YCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogNDIwMCxcbiAgICB9LFxuXG4gICAgdGVzdDoge1xuICAgICAgZ2xvYmFsczogdHJ1ZSxcblxuICAgICAgZW52aXJvbm1lbnQ6IFwianNkb21cIixcblxuICAgICAgZW52aXJvbm1lbnRPcHRpb25zOiB7XG4gICAgICAgIHVybDogXCJodHRwOi8vbG9jYWxob3N0XCIsXG4gICAgICB9LFxuXG4gICAgICBpbmNsdWRlOiBbXCIqKi8qLnRlc3QuanNcIiwgXCIqKi8qLnRlc3QudHNcIiwgXCIqKi8qLnRlc3QuanN4XCIsIFwiKiovKi50ZXN0LnRzeFwiXSxcbiAgICAgIGV4Y2x1ZGU6IFtcIioqL25vZGVfbW9kdWxlcy8qKlwiXSxcblxuICAgICAgc2V0dXBGaWxlczogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJ2aXRlc3Quc2V0dXAudHNcIiksXG5cbiAgICAgIHJlcG9ydGVyczogW1wiZGVmYXVsdFwiLCBcImpzb25cIiwgXCJ2aXRlc3Qtc29uYXItcmVwb3J0ZXJcIl0sXG4gICAgICBvdXRwdXRGaWxlOiB7XG4gICAgICAgIGpzb246IFwicmVwb3J0cy90ZXN0LXJlcG9ydC90ZXN0LXJlcG9ydC5qc29uXCIsXG4gICAgICAgIGh0bWw6IFwicmVwb3J0cy90ZXN0LXJlcG9ydC90ZXN0LXJlcG9ydC5odG1sXCIsXG4gICAgICAgIFwidml0ZXN0LXNvbmFyLXJlcG9ydGVyXCI6IFwicmVwb3J0cy92aXRlLXNvbmFyL3NvbmFyLXJlcG9ydC54bWxcIixcbiAgICAgIH0sXG5cbiAgICAgIGNvdmVyYWdlOiB7XG4gICAgICAgIHByb3ZpZGVyOiBcInY4XCIsXG4gICAgICAgIGluY2x1ZGU6IFtcInNyYy8qKi8qXCJdLFxuICAgICAgICBleGNsdWRlOiBbXCJzcmMvbWFpbi50c3hcIiwgXCJzcmMvbW9jay1zZXJ2ZXIvKiovKlwiLCBcIioudGVzdC4qXCIsIFwiKi9fX21vY2tzX18vKlwiXSxcbiAgICAgICAgcmVwb3J0ZXI6IFtcInRleHRcIiwgXCJodG1sXCIsIFwibGNvdlwiXSxcbiAgICAgICAgcmVwb3J0c0RpcmVjdG9yeTogXCJyZXBvcnRzL3ZpdGUtY292ZXJhZ2VcIixcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICB9LFxuXG4gICAgICBjbGVhck1vY2tzOiB0cnVlLFxuICAgICAgbW9ja1Jlc2V0OiB0cnVlLFxuICAgICAgcmVzdG9yZU1vY2tzOiB0cnVlLFxuICAgICAgdW5zdHViR2xvYmFsczogdHJ1ZSxcbiAgICAgIHVuc3R1YkVudnM6IHRydWUsXG4gICAgfSxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxVSxPQUFPLGdCQUFnQjtBQUU1VixPQUFPLFVBQVU7QUFFakIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUN4QixPQUFPLGFBQWE7QUFDcEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9CO0FBUjdCLElBQU0sbUNBQW1DO0FBVXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFVBQVEsSUFBSSxXQUFXO0FBRXZCLFFBQU0sYUFBYSxTQUFTO0FBRzVCLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUMzQyxTQUFPLEtBQUssR0FBRyxFQUFFLFFBQVEsQ0FBQyxRQUFRO0FBQ2hDLFFBQUksSUFBSSxXQUFXLE9BQU8sR0FBRztBQUMzQixjQUFRLElBQUksR0FBRyxJQUFJLElBQUksR0FBRztBQUFBLElBQzVCO0FBQUEsRUFDRixDQUFDO0FBRUQsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsUUFBUTtBQUFBLFFBQ04sWUFBWTtBQUFBLE1BQ2QsQ0FBQztBQUFBLE1BQ0QsY0FDRSxXQUFXO0FBQUEsUUFDVCxZQUFZLENBQUMsS0FBSztBQUFBLFFBQ2xCLFlBQVksQ0FBQyxhQUFhO0FBQUEsTUFDNUIsQ0FBQztBQUFBLE1BQ0gsTUFBTTtBQUFBLE1BQ04sS0FBSztBQUFBLFFBQ0gsYUFBYSxFQUFFLFlBQVksV0FBVyxLQUFLLE1BQU0sTUFBTSxPQUFPLFdBQVcsS0FBSztBQUFBLFFBQzlFLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNIO0FBQUEsSUFFQSxPQUFPO0FBQUEsTUFDTCxXQUFXLENBQUM7QUFBQSxNQUNaLHNCQUFzQjtBQUFBLElBQ3hCO0FBQUEsSUFFQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsUUFDbEMsS0FBSyxLQUFLLFFBQVEsa0NBQVcsTUFBTTtBQUFBLE1BQ3JDO0FBQUEsSUFDRjtBQUFBLElBRUEsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osZ0JBQWdCO0FBQUEsUUFDbEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBRUEsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUVBLE1BQU07QUFBQSxNQUNKLFNBQVM7QUFBQSxNQUVULGFBQWE7QUFBQSxNQUViLG9CQUFvQjtBQUFBLFFBQ2xCLEtBQUs7QUFBQSxNQUNQO0FBQUEsTUFFQSxTQUFTLENBQUMsZ0JBQWdCLGdCQUFnQixpQkFBaUIsZUFBZTtBQUFBLE1BQzFFLFNBQVMsQ0FBQyxvQkFBb0I7QUFBQSxNQUU5QixZQUFZLEtBQUssUUFBUSxrQ0FBVyxpQkFBaUI7QUFBQSxNQUVyRCxXQUFXLENBQUMsV0FBVyxRQUFRLHVCQUF1QjtBQUFBLE1BQ3RELFlBQVk7QUFBQSxRQUNWLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLHlCQUF5QjtBQUFBLE1BQzNCO0FBQUEsTUFFQSxVQUFVO0FBQUEsUUFDUixVQUFVO0FBQUEsUUFDVixTQUFTLENBQUMsVUFBVTtBQUFBLFFBQ3BCLFNBQVMsQ0FBQyxnQkFBZ0Isd0JBQXdCLFlBQVksZUFBZTtBQUFBLFFBQzdFLFVBQVUsQ0FBQyxRQUFRLFFBQVEsTUFBTTtBQUFBLFFBQ2pDLGtCQUFrQjtBQUFBLFFBQ2xCLFNBQVM7QUFBQSxNQUNYO0FBQUEsTUFFQSxZQUFZO0FBQUEsTUFDWixXQUFXO0FBQUEsTUFDWCxjQUFjO0FBQUEsTUFDZCxlQUFlO0FBQUEsTUFDZixZQUFZO0FBQUEsSUFDZDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
