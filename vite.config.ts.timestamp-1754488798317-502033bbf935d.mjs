// vite.config.ts
import removeAttr from "file:///D:/Projects/NOSTROMO-frontend/node_modules/react-remove-attr/dist/remove-attributes.js";
import path from "node:path";
import react from "file:///D:/Projects/NOSTROMO-frontend/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { loadEnv } from "file:///D:/Projects/NOSTROMO-frontend/node_modules/vite/dist/node/index.js";
import checker from "file:///D:/Projects/NOSTROMO-frontend/node_modules/vite-plugin-checker/dist/esm/main.js";
import svgr from "file:///D:/Projects/NOSTROMO-frontend/node_modules/vite-plugin-svgr/dist/index.js";
import { defineConfig } from "file:///D:/Projects/NOSTROMO-frontend/node_modules/vitest/dist/config.js";
var __vite_injected_original_dirname = "D:\\Projects\\NOSTROMO-frontend";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxOT1NUUk9NTy1mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUHJvamVjdHNcXFxcTk9TVFJPTU8tZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1Byb2plY3RzL05PU1RST01PLWZyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlbW92ZUF0dHIgZnJvbSBcInJlYWN0LXJlbW92ZS1hdHRyXCI7XHJcblxyXG5pbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XHJcblxyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgeyBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGNoZWNrZXIgZnJvbSBcInZpdGUtcGx1Z2luLWNoZWNrZXJcIjtcclxuaW1wb3J0IHN2Z3IgZnJvbSBcInZpdGUtcGx1Z2luLXN2Z3JcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVzdC9jb25maWdcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcclxuICBwcm9jZXNzLmVudi5OT0RFX0VOViA9IG1vZGU7IC8vIE1ha2Ugc3VyZSBOT0RFX0VOViBtYXRjaGVzIG1vZGUgd2hlbiBidWlsZGluZ1xyXG5cclxuICBjb25zdCBpblByb2RNb2RlID0gbW9kZSA9PT0gXCJwcm9kdWN0aW9uXCI7XHJcblxyXG4gIC8vIGV4cG9zZSAuZW52IHZhcnMgdG8gc2VydmVyIGVudmlyb25tZW50IChvbmx5IFZJVEVfIHByZWZpeGVkIHZhcnMpXHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCBcIlwiKTtcclxuICBPYmplY3Qua2V5cyhlbnYpLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgaWYgKGtleS5zdGFydHNXaXRoKFwiVklURV9cIikpIHtcclxuICAgICAgcHJvY2Vzcy5lbnZba2V5XSA9IGVudltrZXldO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICBjaGVja2VyKHtcclxuICAgICAgICB0eXBlc2NyaXB0OiB0cnVlLFxyXG4gICAgICB9KSxcclxuICAgICAgaW5Qcm9kTW9kZSAmJlxyXG4gICAgICAgIHJlbW92ZUF0dHIoe1xyXG4gICAgICAgICAgZXh0ZW5zaW9uczogW1widHN4XCJdLFxyXG4gICAgICAgICAgYXR0cmlidXRlczogW1wiZGF0YS10ZXN0aWRcIl0sXHJcbiAgICAgICAgfSksXHJcbiAgICAgIHJlYWN0KCksXHJcbiAgICAgIHN2Z3Ioe1xyXG4gICAgICAgIHN2Z3JPcHRpb25zOiB7IGV4cG9ydFR5cGU6IFwiZGVmYXVsdFwiLCByZWY6IHRydWUsIHN2Z286IGZhbHNlLCB0aXRsZVByb3A6IHRydWUgfSxcclxuICAgICAgICBpbmNsdWRlOiBcIioqLyouc3ZnXCIsXHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBzb3VyY2VtYXA6ICFpblByb2RNb2RlLFxyXG4gICAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogZmFsc2UsXHJcbiAgICB9LFxyXG5cclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIiksXHJcbiAgICAgICAgXCIjXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwidGVzdFwiKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgY3NzOiB7XHJcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICBzY3NzOiB7XHJcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEBpbXBvcnQgXCJAL3NoYXJlZC90aGVtZS5zY3NzXCI7YCxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgcG9ydDogNDIwMCxcclxuICAgIH0sXHJcblxyXG4gICAgdGVzdDoge1xyXG4gICAgICBnbG9iYWxzOiB0cnVlLFxyXG5cclxuICAgICAgZW52aXJvbm1lbnQ6IFwianNkb21cIixcclxuXHJcbiAgICAgIGVudmlyb25tZW50T3B0aW9uczoge1xyXG4gICAgICAgIHVybDogXCJodHRwOi8vbG9jYWxob3N0XCIsXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBpbmNsdWRlOiBbXCIqKi8qLnRlc3QuanNcIiwgXCIqKi8qLnRlc3QudHNcIiwgXCIqKi8qLnRlc3QuanN4XCIsIFwiKiovKi50ZXN0LnRzeFwiXSxcclxuICAgICAgZXhjbHVkZTogW1wiKiovbm9kZV9tb2R1bGVzLyoqXCJdLFxyXG5cclxuICAgICAgc2V0dXBGaWxlczogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJ2aXRlc3Quc2V0dXAudHNcIiksXHJcblxyXG4gICAgICByZXBvcnRlcnM6IFtcImRlZmF1bHRcIiwgXCJqc29uXCIsIFwidml0ZXN0LXNvbmFyLXJlcG9ydGVyXCJdLFxyXG4gICAgICBvdXRwdXRGaWxlOiB7XHJcbiAgICAgICAganNvbjogXCJyZXBvcnRzL3Rlc3QtcmVwb3J0L3Rlc3QtcmVwb3J0Lmpzb25cIixcclxuICAgICAgICBodG1sOiBcInJlcG9ydHMvdGVzdC1yZXBvcnQvdGVzdC1yZXBvcnQuaHRtbFwiLFxyXG4gICAgICAgIFwidml0ZXN0LXNvbmFyLXJlcG9ydGVyXCI6IFwicmVwb3J0cy92aXRlLXNvbmFyL3NvbmFyLXJlcG9ydC54bWxcIixcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNvdmVyYWdlOiB7XHJcbiAgICAgICAgcHJvdmlkZXI6IFwidjhcIixcclxuICAgICAgICBpbmNsdWRlOiBbXCJzcmMvKiovKlwiXSxcclxuICAgICAgICBleGNsdWRlOiBbXCJzcmMvbWFpbi50c3hcIiwgXCJzcmMvbW9jay1zZXJ2ZXIvKiovKlwiLCBcIioudGVzdC4qXCIsIFwiKi9fX21vY2tzX18vKlwiXSxcclxuICAgICAgICByZXBvcnRlcjogW1widGV4dFwiLCBcImh0bWxcIiwgXCJsY292XCJdLFxyXG4gICAgICAgIHJlcG9ydHNEaXJlY3Rvcnk6IFwicmVwb3J0cy92aXRlLWNvdmVyYWdlXCIsXHJcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjbGVhck1vY2tzOiB0cnVlLFxyXG4gICAgICBtb2NrUmVzZXQ6IHRydWUsXHJcbiAgICAgIHJlc3RvcmVNb2NrczogdHJ1ZSxcclxuICAgICAgdW5zdHViR2xvYmFsczogdHJ1ZSxcclxuICAgICAgdW5zdHViRW52czogdHJ1ZSxcclxuICAgIH0sXHJcbiAgfTtcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1EsT0FBTyxnQkFBZ0I7QUFFdFMsT0FBTyxVQUFVO0FBRWpCLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sVUFBVTtBQUNqQixTQUFTLG9CQUFvQjtBQVI3QixJQUFNLG1DQUFtQztBQVV6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxVQUFRLElBQUksV0FBVztBQUV2QixRQUFNLGFBQWEsU0FBUztBQUc1QixRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDM0MsU0FBTyxLQUFLLEdBQUcsRUFBRSxRQUFRLENBQUMsUUFBUTtBQUNoQyxRQUFJLElBQUksV0FBVyxPQUFPLEdBQUc7QUFDM0IsY0FBUSxJQUFJLEdBQUcsSUFBSSxJQUFJLEdBQUc7QUFBQSxJQUM1QjtBQUFBLEVBQ0YsQ0FBQztBQUVELFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLFFBQVE7QUFBQSxRQUNOLFlBQVk7QUFBQSxNQUNkLENBQUM7QUFBQSxNQUNELGNBQ0UsV0FBVztBQUFBLFFBQ1QsWUFBWSxDQUFDLEtBQUs7QUFBQSxRQUNsQixZQUFZLENBQUMsYUFBYTtBQUFBLE1BQzVCLENBQUM7QUFBQSxNQUNILE1BQU07QUFBQSxNQUNOLEtBQUs7QUFBQSxRQUNILGFBQWEsRUFBRSxZQUFZLFdBQVcsS0FBSyxNQUFNLE1BQU0sT0FBTyxXQUFXLEtBQUs7QUFBQSxRQUM5RSxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUFBLElBRUEsT0FBTztBQUFBLE1BQ0wsV0FBVyxDQUFDO0FBQUEsTUFDWixzQkFBc0I7QUFBQSxJQUN4QjtBQUFBLElBRUEsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLFFBQ2xDLEtBQUssS0FBSyxRQUFRLGtDQUFXLE1BQU07QUFBQSxNQUNyQztBQUFBLElBQ0Y7QUFBQSxJQUVBLEtBQUs7QUFBQSxNQUNILHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQSxVQUNKLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUVBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFFQSxNQUFNO0FBQUEsTUFDSixTQUFTO0FBQUEsTUFFVCxhQUFhO0FBQUEsTUFFYixvQkFBb0I7QUFBQSxRQUNsQixLQUFLO0FBQUEsTUFDUDtBQUFBLE1BRUEsU0FBUyxDQUFDLGdCQUFnQixnQkFBZ0IsaUJBQWlCLGVBQWU7QUFBQSxNQUMxRSxTQUFTLENBQUMsb0JBQW9CO0FBQUEsTUFFOUIsWUFBWSxLQUFLLFFBQVEsa0NBQVcsaUJBQWlCO0FBQUEsTUFFckQsV0FBVyxDQUFDLFdBQVcsUUFBUSx1QkFBdUI7QUFBQSxNQUN0RCxZQUFZO0FBQUEsUUFDVixNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTix5QkFBeUI7QUFBQSxNQUMzQjtBQUFBLE1BRUEsVUFBVTtBQUFBLFFBQ1IsVUFBVTtBQUFBLFFBQ1YsU0FBUyxDQUFDLFVBQVU7QUFBQSxRQUNwQixTQUFTLENBQUMsZ0JBQWdCLHdCQUF3QixZQUFZLGVBQWU7QUFBQSxRQUM3RSxVQUFVLENBQUMsUUFBUSxRQUFRLE1BQU07QUFBQSxRQUNqQyxrQkFBa0I7QUFBQSxRQUNsQixTQUFTO0FBQUEsTUFDWDtBQUFBLE1BRUEsWUFBWTtBQUFBLE1BQ1osV0FBVztBQUFBLE1BQ1gsY0FBYztBQUFBLE1BQ2QsZUFBZTtBQUFBLE1BQ2YsWUFBWTtBQUFBLElBQ2Q7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
