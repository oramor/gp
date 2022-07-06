import { URL } from 'url';
import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackInjector from 'html-webpack-injector';

/**
 * Имя корневой директории, в которой лежат директории
 * с файлами для страниц
 */
const pagesDirName = 'pages';

/**
 * Постфикс, который должен добавляться к tsx-файлу, который
 * описывает чанку для каждой страницы
 */
const chunkPostfix = 'Chunk';

const __dirname = new URL('.', import.meta.url).pathname;
const projDir = path.join(__dirname, 'packages/consumer');
const outDir = path.join(projDir, '_public');
const srcDir = path.join(projDir, '');
const tplDir = path.join(outDir, pagesDirName);

const PAGES = ['MainPage'];

function getPageEntryPoints() {
    const obj = {};

    PAGES.forEach((pageName) => {
        const chunkFileName = pageName + chunkPostfix + '.tsx';
        const templatePath = `.${path.sep}` + path.join(pagesDirName, pageName, chunkFileName);
        obj[pageName] = templatePath;
    });

    return obj;
}

function getPagePlugins() {
    const arr = [];

    PAGES.forEach((pageName) => {
        /**
         * Пушим инстансы HtmlWebpackPlugin, поскольку
         * на каждую страницу требуется отдельный
         * экземпляр
         */
        arr.push(
            new HtmlWebpackPlugin({
                /**
                 * Адрес указывается относительно контекста (srcDir).
                 * Точка перед путем обязательна
                 */
                template: './' + path.join('pages', pageName, pageName + '.ejs'),
                /**
                 * Адрес, по которому будет размещен файл. Указывается
                 * относительно outDir. Здесь точка уже не нужна
                 */
                filename: path.join('views', pageName + '.hbs'),
                /**
                 * Элементами массива являются названия чанок
                 * из объекта, переданного в опцию entry
                 */
                chunks: ['index', pageName],
            }),
        );

        /**
         * Плагин добавляет к странице ссылку на чанку
         */
        arr.push(new HtmlWebpackInjector());
    });

    return arr;
}

export default {
    mode: 'development',
    entry: {
        /**
         * Первой обрабатывается индексная чанка (в данном случае файл
         * с именем index.ts). Не забываем про точку перед именем.
         */
        index: './' + path.join(srcDir, 'index.ts'),
        ...getPageEntryPoints(),
    },
    context: srcDir,
    output: {
        path: outDir,
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
                            configFile: 'tsconfig.public.json',
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
    plugins: [new CleanWebpackPlugin(), ...getPagePlugins()],
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
            directory: 'packages/consumer/_web',
        },
        compress: true,
        port: 9000,
    },
};
