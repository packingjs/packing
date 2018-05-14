export default {
  additionalProperties: true,
  properties: {
    localhost: {
      description: '本地开发环境 webserver 使用的域名',
      type: 'string',
      minLength: 1
    },
    port: {
      description: '本地 webserver 端口信息',
      type: 'object',
      additionalProperties: false,
      properties: {
        dev: {
          description: '本地开发环境 webserver 使用的端口',
          type: 'number'
        },
        dist: {
          description: '本地预览编译结果时 webserver 使用的端口',
          type: 'number'
        }
      }
    },
    path: {
      description: '文件路径配置',
      type: 'object',
      additionalProperties: false,
      properties: {
        src: {
          description: '源文件相关路径',
          type: 'object',
          additionalProperties: false,
          properties: {
            root: {
              description: '源文件根目录',
              type: 'string'
            },
            templates: {
              oneOf: [
                {
                  description: '模版文件路径',
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    layout: {
                      description: '模版布局文件',
                      type: 'string'
                    },
                    pages: {
                      description: '模版页面文件',
                      type: 'string'
                    }
                  }
                },
                {
                  description: '不包含模版布局文件路径',
                  type: 'string'
                }
              ]
            }
          }
        },
        dist: {
          description: '源文件相关路径',
          type: 'object',
          additionalProperties: false,
          properties: {
            root: {
              description: '编译产物输出目录',
              type: 'string'
            },
            templates: {
              oneOf: [
                {
                  description: '模版文件输出路径',
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    layout: {
                      description: '模版布局文件输出路径',
                      type: 'string'
                    },
                    pages: {
                      description: '模版页面文件输出问题',
                      type: 'string'
                    }
                  }
                },
                {
                  description: '不包含模版布局文件路径',
                  type: 'string'
                }
              ]
            },
            js: {
              description: 'JavaScript文件输出目录',
              type: 'string'
            },
            css: {
              description: '样式文件输出目录',
              type: 'string'
            }
          }
        },
        mockPages: {
          description: '页面初始化mock数据文件存放目录',
          type: 'string'
        },
        tmpDll: {
          description: 'dllPlugin编译输出物临时存放目录',
          type: 'string'
        },
        entries: {
          description: 'JavaScript入口',
          oneOf: [
            {
              type: 'string',
              minLength: 1
            },
            {
              type: 'object',
              additionalProperties: true
            },
            {
              instanceof: 'Function'
            }
          ]
        }
      }
    },
    template: {
      description: '模版插件配置',
      type: 'object',
      additionalProperties: false,
      properties: {
        enabled: {
          description: '模版插件配置开关',
          type: 'boolean'
        },
        options: {
          description: '模版插件配置项',
          type: 'object',
          additionalProperties: false,
          properties: {
            engine: {
              description: '模版引擎类型',
              enum: [
                'html',
                'pug',
                'ejs',
                'handlebars',
                'smarty',
                'velocity'
              ]
            },
            extension: {
              description: '模版文件扩展名',
              type: 'string'
            },
            autoGeneration: {
              description: '是否自动生成网页文件开关',
              type: 'boolean'
            },
            inject: {
              description: '是否往网页中注入生成的静态资源文件',
              type: 'boolean'
            },
            scriptInjectPosition: {
              description: 'JavaScript文件注入到哪个标签前面',
              enum: [
                'head',
                'body'
              ]
            },
            injectManifest: {
              description: '是否往网页中注入manifest.json引用',
              type: 'boolean'
            },
            manifest: {
              description: 'manifest.json输出位置',
              type: 'string'
            },
            master: {
              description: '母模版位置',
              type: 'string'
            },
            charset: {
              description: '输出网页使用的字符编码',
              type: 'string'
            },
            title: {
              description: '输出网页使用的标题',
              type: 'string'
            },
            favicon: {
              description: '输出网页使用的favicon图标',
              oneOf: [
                {
                  type: 'boolean'
                },
                {
                  type: 'string'
                }
              ]
            },
            keywords: {
              description: '输出网页使用的关键字',
              oneOf: [
                {
                  type: 'boolean'
                },
                {
                  type: 'string'
                }
              ]
            },
            description: {
              description: '输出网页使用的描述',
              oneOf: [
                {
                  type: 'boolean'
                },
                {
                  type: 'string'
                }
              ]
            },
            attrs: {
              description: '需要在编译时替换为hash的标签属性列表',
              type: 'array',
              items: {
                type: 'string'
              }
            },
            path: {
              description: '模版中命中的静态文件编译输出的文件名',
              type: 'string'
            }
          }
        }
      }
    },
    longTermCaching: {
      description: '长效缓存配置',
      type: 'object',
      additionalProperties: false,
      properties: {
        enabled: {
          description: '长效缓存开关',
          type: 'boolean'
        },
        options: {
          description: '长效缓存选项',
          type: 'object',
          additionalProperties: true
        }
      }
    },
    minimize: {
      description: '压缩代码配置',
      type: 'object',
      additionalProperties: false,
      properties: {
        enabled: {
          description: '压缩代码开关',
          type: 'boolean'
        },
        options: {
          description: '压缩代码选项',
          type: 'object',
          additionalProperties: true
        }
      }
    },
    cssLoader: {
      description: 'cssLoader配置',
      type: 'object',
      additionalProperties: true
    },
    stylelint: {
      description: 'stylelint配置',
      type: 'object',
      additionalProperties: false,
      properties: {
        enabled: {
          description: 'stylelint开关',
          type: 'boolean'
        },
        options: {
          description: 'stylelint选项',
          type: 'object',
          additionalProperties: true
        }
      }
    },
    eslint: {
      description: 'eslint配置',
      type: 'object',
      additionalProperties: false,
      properties: {
        enabled: {
          description: 'eslint开关',
          type: 'boolean'
        },
        options: {
          description: 'eslint选项',
          type: 'object',
          additionalProperties: true
        }
      }
    },
    runtimeChunk: {
      description: 'runtimeChunk配置',
      type: 'object',
      additionalProperties: false,
      properties: {
        enabled: {
          description: 'runtimeChunk开关',
          type: 'boolean'
        },
        name: {
          description: 'runtimeChunk输出的文件名',
          type: 'string'
        }
      }
    },
    commonChunks: {
      description: 'commonChunks配置',
      type: 'object',
      additionalProperties: true
    },
    visualizer: {
      description: 'webpack-visualizer-plugin配置',
      type: 'object',
      additionalProperties: false,
      properties: {
        enabled: {
          description: 'visualizer开关',
          type: 'boolean'
        },
        options: {
          description: 'visualizer选项',
          type: 'object',
          additionalProperties: true
        }
      }
    },
    graphql: {
      description: 'GraphQL配置',
      type: 'object',
      additionalProperties: false,
      properties: {
        enabled: {
          description: '是否启用GraphQL Mock Server开关',
          type: 'boolean'
        },
        options: {
          description: 'GraphQL Mock Server选项',
          type: 'object',
          additionalProperties: true
        }
      }
    },
    assetExtensions: {
      description: '静态资源类型',
      type: 'array',
      items: {
        type: 'string'
      }
    },
    rewriteRules: {
      description: 'URL转发路由规则配置',
      type: 'object',
      additionalProperties: true
    }
  }
};
