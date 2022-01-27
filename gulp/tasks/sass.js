import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';// Сжатие
import webpcss from 'gulp-avif-css';// Вывод webp изображений
import autoprefixer from 'gulp-autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';// Группировка медиа запросов

const scss = gulpSass(dartSass);

export const sass = () => {
  return app.gulp.src(app.path.src.sass, { sourcemaps: app.isDev })
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: "SASS",
        message: "Error: <%= error.message %>"
      }))
    )
    .pipe(scss({
      includePaths: ['node_modules'],
      outputStyle: 'expanded'
    }))
    .pipe(app.plugins.replace(/@img\//g, '../img/'))
    .pipe(
      app.plugins.if(
        app.isBuild,
        groupCssMediaQueries()
      )
    )
    .pipe(
      app.plugins.if(
        app.isBuild,
        webpcss({
          webpClass: '.webp',
          noWebpClass: '.no-webp'
        })
      )
    )
    .pipe(
      app.plugins.if(
        app.isBuild,
        autoprefixer({
          grid: false,
          flexbox: false,
          overrideBrowserslist: ["last 3 versions"],
          cascade: true
        })    
      )
    )
    .pipe(app.gulp.dest(app.path.build.css)) // Выгрузка не сжатого
    .pipe(
      app.plugins.if(
        app.isBuild,
        cleanCss({
          level: 2
        })
      )
    )
    .pipe(rename({
      extname: ".min.css"
    }))
    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(app.plugins.browsersync.stream());
}