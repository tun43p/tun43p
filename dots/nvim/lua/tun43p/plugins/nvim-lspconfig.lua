return {
  "neovim/nvim-lspconfig",
  dependencies = {
      { "williamboman/mason.nvim" },
      { "williamboman/mason-lspconfig.nvim" },
      { "hrsh7th/nvim-cmp" },
      { "hrsh7th/cmp-nvim-lsp" },
      { "L3MON4D3/LuaSnip" },
      { "rafamadriz/friendly-snippets" },
      { "hrsh7th/cmp-buffer" },
      { "hrsh7th/cmp-path" },
      { "hrsh7th/cmp-cmdline" },
      { "saadparwaiz1/cmp_luasnip" },
  },
	config = function()
		require("mason").setup({})
		require("mason-lspconfig").setup({
			ensure_installed = {
        "bashls", -- Bash
        "clangd", -- C/C++
        "cmake", -- CMake
        "dockerls", -- Dockefile
        "docker_compose_language_service", -- Docker Compose
        "jsonls", -- JSON
        "lua_ls", -- Lua
        "marksman", -- Markdown
				"ruff", -- Python
				"yamlls", -- YAML

        -- TODO(tun43p): https://mason-registry.dev/registry/list
				-- "astro-language-server", -- Astro
				-- "bash-language-server", -- Bash
				-- "clangd", -- C/C++
				-- "cmake-language-server", -- CMake
				-- "css-lsp", -- CSS
				-- "deno", -- Deno
				-- "dockerfile-language-server", -- Dockefile
				-- "docker-compose-language-server", -- Docker Compose
				-- "eslint-lsp", -- Eslint
				-- "golangci-lint-langserver", -- Golang
				-- "gitlab-ci-ls", -- Gitlab CI
				-- "gradle-language-server", -- Gradle
				-- "html-lsp", -- HTML
				-- "json-lsp", -- JSON
				-- "kotlin-language-server", -- Kotlin
				-- "lua-language-server", -- Lua
				-- "marksman", -- Markdown
				-- "prisma-language-server", -- Prisma
				-- "python-language-server", -- Python
				-- "taplo", -- TOML
				-- "solidity", -- Solidity
				-- "tailwindcss-language-server", -- Tailwind CSS
				-- "vue-language-server", -- Vue
			},
			handlers = {
				function(server_name)
					-- Configuration par défaut pour tous les serveurs
					vim.lsp.config(server_name, {})
				end,

				["lua_ls"] = function()
					vim.lsp.config("lua_ls", {
						settings = {
							Lua = {
								diagnostics = {
									globals = { "vim" }
								}
							}
						}
					})
				end,
			},
		})

		-- Activer les serveurs LSP
		local servers = require("mason-lspconfig").get_installed_servers()
		for _, server in ipairs(servers) do
			vim.lsp.enable(server)
		end

		-- Configuration des keymaps LSP
		vim.api.nvim_create_autocmd('LspAttach', {
			group = vim.api.nvim_create_augroup('UserLspConfig', {}),
			callback = function(ev)
				local opts = { buffer = ev.buf, remap = false }

				vim.keymap.set("n", "gr", function()
					vim.lsp.buf.references()
				end, vim.tbl_deep_extend("force", opts, { desc = "LSP Goto Reference" }))
				vim.keymap.set("n", "gd", function()
					vim.lsp.buf.definition()
				end, vim.tbl_deep_extend("force", opts, { desc = "LSP Goto Definition" }))
				vim.keymap.set("n", "K", function()
					vim.lsp.buf.hover()
				end, vim.tbl_deep_extend("force", opts, { desc = "LSP Hover" }))
				vim.keymap.set("n", "<leader>vws", function()
					vim.lsp.buf.workspace_symbol()
				end, vim.tbl_deep_extend("force", opts, { desc = "LSP Workspace Symbol" }))
				vim.keymap.set("n", "<leader>vd", function()
					vim.diagnostic.setloclist()
				end, vim.tbl_deep_extend("force", opts, { desc = "LSP Show Diagnostics" }))
				vim.keymap.set("n", "[d", function()
					vim.diagnostic.goto_next()
				end, vim.tbl_deep_extend("force", opts, { desc = "Next Diagnostic" }))
				vim.keymap.set("n", "]d", function()
					vim.diagnostic.goto_prev()
				end, vim.tbl_deep_extend("force", opts, { desc = "Previous Diagnostic" }))
				vim.keymap.set("n", "<leader>vca", function()
					vim.lsp.buf.code_action()
				end, vim.tbl_deep_extend("force", opts, { desc = "LSP Code Action" }))
				vim.keymap.set("n", "<leader>vrr", function()
					vim.lsp.buf.references()
				end, vim.tbl_deep_extend("force", opts, { desc = "LSP References" }))
				vim.keymap.set("n", "<leader>vrn", function()
					vim.lsp.buf.rename()
				end, vim.tbl_deep_extend("force", opts, { desc = "LSP Rename" }))
				vim.keymap.set("i", "<C-h>", function()
					vim.lsp.buf.signature_help()
				end, vim.tbl_deep_extend("force", opts, { desc = "LSP Signature Help" }))
			end,
		})

     -- Configuration de nvim-cmp
     local cmp = require("cmp")
     local cmp_select = { behavior = cmp.SelectBehavior.Select }

     require("luasnip.loaders.from_vscode").lazy_load()

     -- `/` cmdline setup.
     cmp.setup.cmdline("/", {
         mapping = cmp.mapping.preset.cmdline(),
         sources = {
             { name = "buffer" },
         },
     })

     -- `:` cmdline setup.
     cmp.setup.cmdline(":", {
         mapping = cmp.mapping.preset.cmdline(),
         sources = cmp.config.sources({
             { name = "path" },
         }, {
             {
                 name = "cmdline",
                 option = {
                     ignore_cmds = { "Man", "!" },
                 },
             },
         }),
     })

     cmp.setup({
      snippet = {
        expand = function(args)
          require("luasnip").lsp_expand(args.body)
        end,
      },
      sources = {
        { name = "nvim_lsp" },
        { name = "luasnip", keyword_length = 2 },
        { name = "buffer", keyword_length = 3 },
        { name = "path" },
      },
      mapping = cmp.mapping.preset.insert({
        ["<C-p>"] = cmp.mapping.select_prev_item(cmp_select),
        ["<C-n>"] = cmp.mapping.select_next_item(cmp_select),
        ["<CR>"] = cmp.mapping.confirm({ select = true }),
        ["<C-Space>"] = cmp.mapping.complete(),
        ["<Tab>"] = cmp.mapping(function(fallback)
          if cmp.visible() then
            cmp.select_next_item()
          elseif require("luasnip").expand_or_jumpable() then
            require("luasnip").expand_or_jump()
          else
            fallback()
          end
        end, { "i", "s" }),
        ["<S-Tab>"] = cmp.mapping(function(fallback)
          if cmp.visible() then
            cmp.select_prev_item()
          elseif require("luasnip").jumpable(-1) then
            require("luasnip").jump(-1)
          else
            fallback()
          end
        end, { "i", "s" }),
      }),
    })
	end,
}
