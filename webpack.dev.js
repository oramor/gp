import { URL } from 'url';
import path from 'path';
import { access } from 'node:fs/promises';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackInjector from 'html-webpack-injector';

const config = {
    pagesDirName: 'pages',
    projectsDirName: 'packages',
    currentProjectDirName: 'customer',
    sourceDirName: 'source',
    outputDirName: '_public',
    outputTemplatesDirName: 'views',
    chunkPostfix: 'Chunk',
    rootPath: 'current',
    indexFileName: 'index.ts',
    pages: ['MainPage'],
};

class WebpackConfigHelper {
    constructor(config) {
        this.config = config;
        this.pagesDirName = config.pagesDirName;
        this.projectsDirName = config.projectsDirName;
        this.currentProjectDirName = config.currentProjectDirName;
        this.outputDirName = config.outputDirName;
        this.outputTemplatesDirName = config.outputTemplatesDirName;
        this.rootPath = this._getRootPath();
    }

    _getRootPath() {
        if (!this.config.rootPath || this.config.rootPath === 'current') {
            return new URL('.', import.meta.url).pathname;
        }

        return this.config.rootPath;
    }

    _getPageEntryPoints() {
        const pages = this.config.pages;
        const obj = {};

        pages.forEach((pageName) => {
            const chunkFileName = pageName + this.config.chunkPostfix + '.tsx';
            const templatePath =
                `.${path.sep}` + path.join(this.pagesDirName, pageName, chunkFileName);
            obj[pageName] = templatePath;
        });

        return obj;
    }

    async _checkAccess(path) {
        try {
            await access(path);
            console.log(`Path ${path} is accessible`);
        } catch {
            console.error(`Path ${path} is NOT accessible`);
        }
    }

    get projectDir() {
        return path.join(this.rootPath, this.projectsDirName, this.currentProjectDirName);
    }

    get outputDir() {
        return path.join(this.projectDir, this.outputDirName);
    }

    get outputTemplateDir() {
        return path.join(this.outputDir, this.outputTemplatesDirName);
    }

    get contextDir() {
        return this.projectDir;
    }

    get indexFilePath() {
        const fileName = this.config.indexFileName;
        const sourceDirName = this.config.sourceDirName;

        /**
         * Путь указыватся относительно директории
         * контекста (contextDir)
         */
        return './' + path.join(sourceDirName, fileName);
    }

    get entryPoints() {
        return {
            index: this.indexFilePath,
            ...this._getPageEntryPoints(),
        };
    }

    get pagePlugins() {
        const pages = this.config.pages;
        const arr = [];

        pages.forEach((pageName) => {
            const outputTemplatesDirName = config.outputTemplatesDirName;
            /**
             * Адрес указывается относительно контекста (srcDir).
             * Точка перед путем обязательна
             */
            const templFilePath = './' + path.join(this.pagesDirName, pageName, pageName + '.ejs');
            /**
             * Адрес, по которому будет размещен файл. Указывается
             * относительно outDir. Здесь точка уже не нужна
             */
            const filePath = path.join(outputTemplatesDirName, pageName + '.hbs');
            /**
             * Чанки идентифицируются по именам файлов точек входа,
             * которые были переданы в оъект параметра entry
             */
            const chunks = ['index', pageName];
            /**
             * Пушим инстансы HtmlWebpackPlugin, поскольку
             * на каждую страницу требуется отдельный
             * экземпляр
             */
            arr.push(
                new HtmlWebpackPlugin({
                    template: templFilePath,
                    filename: filePath,
                    chunks,
                }),
            );

            /**
             * Плагин добавляет к странице ссылку на чанку
             */
            arr.push(new HtmlWebpackInjector());
        });

        return arr;
    }
}

const helper = new WebpackConfigHelper(config);

export default {
    mode: 'development',
    entry: helper.entryPoints,
    context: helper.contextDir,
    output: {
        path: helper.outputDir,
        filename: 'js/[name].js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.json',
                            transpileOnly: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.ejs$/,
                use: [
                    {
                        loader: 'ejs-compiled-loader',
                        options: {
                            htmlmin: false,
                            htmlminOptions: {
                                removeComments: true,
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [new CleanWebpackPlugin(), ...helper.pagePlugins],
    optimization: {
        minimize: false,
        splitChunks: {
            cacheGroups: {
                /**
                 * Все импорты, которые приходят из node_modules,
                 * будут упакованы в этот чанк
                 */
                vendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'initial',
                    reuseExistingChunk: true,
                },
            },
        },
    },
    devServer: {
        static: {
            directory: 'packages/consumer/_public/views/MainPage',
        },
        compress: true,
        port: 9000,
    },
};
