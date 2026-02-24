![toktrack overview](assets/demo.gif)

**With [toktrack](https://github.com/mag123c/toktrack), Ultra-fast token & cost tracker for AI coding CLIs (Claude Code, Codex CLI, Gemini CLI)**

  
<br>
<br>
  
## 📖 Open Source Contributions

### [nestjs](https://github.com/nestjs)
  [**nest**](https://github.com/nestjs/nest)
  - ✅ common: Improved file validation error messages with dynamic context like file size and MIME type [#14213](https://github.com/nestjs/nest/pull/14213)
  - ✅ common: Added mimetype fallback for more reliable file type validation [#14995](https://github.com/nestjs/nest/pull/14995)
  - 🔄 common: Backport FileTypeValidator fallback support to v10 [#15003](https://github.com/nestjs/nest/pull/15003)
  - ✅ common: Added forceConsole option to ConsoleLogger for bypassing custom loggers when needed [#15503](https://github.com/nestjs/nest/pull/15503)
  - ❌ core: Added declarative route rewrites support for backward compatibility [#15630](https://github.com/nestjs/nest/pull/15630)
  - ✅ core: Skip lifecycle hooks for non-instantiated transient services [#15571](https://github.com/nestjs/nest/pull/15571)
  - ✅ core: Resolve extras in configurable module builder async methods [#15705](https://github.com/nestjs/nest/pull/15705)
  - ✅ core: Ensure nested transient provider isolation [#15815](https://github.com/nestjs/nest/pull/15815)
  - ✅ core: Added option for async logger compatibility [#15986](https://github.com/nestjs/nest/pull/15986)
  - ✅ core: Resolve instantiate nested transient providers in static context [#16098](https://github.com/nestjs/nest/pull/16098)
  - ✅ microservices: Fixed custom transport strategy injection in dynamic microservice configuration [#15172](https://github.com/nestjs/nest/pull/15172)
  - ✅ platform-fastify: Fixed FastifyAdapter middleware registration before init in testing scenarios [#15385](https://github.com/nestjs/nest/pull/15385)
  - ✅ sample: Fixed Sample for update gql federation samples to use production-ready [#15539](https://github.com/nestjs/nest/pull/15539)
  - ✅ sample: Made sample 34 test resilient to external package format changes [#15835](https://github.com/nestjs/nest/pull/15835)
  - ✅ sample: Fixed sample 22 for Prisma 7 compatibility [#15984](https://github.com/nestjs/nest/pull/15984)
  - ❌ isolate nested transient providers in static context [#16258](https://github.com/nestjs/nest/pull/16258)
  
  [**graphql**](https://github.com/nestjs/graphql)
  - ✅ graphql: Added typeName option for custom type naming [#3678](https://github.com/nestjs/graphql/pull/3678)
  
  [**swagger**](https://github.com/nestjs/swagger)
  - ✅ Added options to selectively disable Swagger UI and JSON/YAML endpoints [#3185](https://github.com/nestjs/swagger/pull/3185)
  - ✅ Added custom extension properties support for security schemes [#3248](https://github.com/nestjs/swagger/pull/3248)
  - ✅ Restored x-enumNames support for better API client generator compatibility [#3307](https://github.com/nestjs/swagger/pull/3307)
  - ✅ Added skipDefaultValues option to omit unspecified default fields and corresponding test [#3423](https://github.com/nestjs/swagger/pull/3423)
  - 🔄 Added type definition for format option in @ApiProperty() [#3596](https://github.com/nestjs/swagger/pull/3596)
  - ❌ feat(swagger): add extension in SecuritySchemeObject [#3247](https://github.com/nestjs/swagger/pull/3247)
  
  [**terminus**](https://github.com/nestjs/terminus)
  - ✅ terminus: Added forRootAsync for DynamicModule Configurations [#2670](https://github.com/nestjs/terminus/pull/2670)
  - 🔄 terminus: Enhanced production-ready with GracefulShutdown sequence [#2671](https://github.com/nestjs/terminus/pull/2671)
  - 🔄 terminus: Update amqplib to 0.10.6 for rmq 4.1+ compatibility [#2673](https://github.com/nestjs/terminus/pull/2673)
  
  [**docs.nestjs.com**](https://github.com/nestjs/docs.nestjs.com)
  - ✅ docs(swagger): add ui/raws description, hint [#3206](https://github.com/nestjs/docs.nestjs.com/pull/3206)
  - ✅ docs(swc): add vitest alias resolution configuration [#3204](https://github.com/nestjs/docs.nestjs.com/pull/3204)
  
### [nodejs](https://github.com/nodejs/node)
- ✅ doc: Enhanced HTTP agent createConnection documentation with synchronous behavior clarification [#58205](https://github.com/nodejs/node/pull/58205)
- 🔄 doc: Improved glob pattern documentation with detailed syntax and examples [#58988](https://github.com/nodejs/node/pull/58988)
- ❌ fs: Fixed ENOENT errors on Windows drive root paths [#58989](https://github.com/nodejs/node/pull/58989)
- 🔄 path: Added exclude option to path.matchesGlob method for advanced pattern filtering and fs.glob consistency [#59061](https://github.com/nodejs/node/pull/59061)
- 🔄 test_runner: Added classname hierarchy for JUnit reporter [#60220](https://github.com/nodejs/node/pull/60220)
- ✅ esm: Fixed improve error messages for ambiguous module syntax [#60376](https://github.com/nodejs/node/pull/60376)
- ✅ doc: Added reusePort error behavior to net module [#61250](https://github.com/nodejs/node/pull/61250)
- 🔄 test_runner: Print coverage and diagnostic info with dot reporter [#61423](https://github.com/nodejs/node/pull/61423)

### [loki](https://github.com/grafana/loki)
- ✅ fix generic placeholder definitions for int and duration types [#20485](https://github.com/grafana/loki/pull/20485)
- 🔄 default loki-mixin dashboards to TSDB [#18732](https://github.com/grafana/loki/pull/18732)

### [gemini-cli](https://github.com/google-gemini/gemini-cli)
- ✅ parallelize memory discovery file operations performance gain [#5751](https://github.com/google-gemini/gemini-cli/pull/5751)
- ❌ handle EISDIR error when GEMINI.md is a directory [#17840](https://github.com/google-gemini/gemini-cli/pull/17840)
- ❌ remove user email from /about command output [#17650](https://github.com/google-gemini/gemini-cli/pull/17650)

### [prisma](https://github.com/prisma/prisma)
- ✅ fix(client): add default generic parameters to PrismaClient constructor(6.14.0 breaking changes) [#27897](https://github.com/prisma/prisma/pull/27897)

### [typeorm](https://github.com/typeorm/typeorm)
- ✅ fix: include joined entity primary keys in pagination subquery [#11669](https://github.com/typeorm/typeorm/pull/11669)
- ✅ refactor: replace uuid with native Crypto API [#11769](https://github.com/typeorm/typeorm/pull/11769)

### [django-rest-framework](https://github.com/encode/django-rest-framework)
- 🔄 Fix viewset actions dict being mutated after first request [#9853](https://github.com/encode/django-rest-framework/pull/9853)
- 🔄 Add nulls_distinct support to UniqueTogetherValidator [#9866](https://github.com/encode/django-rest-framework/pull/9866)

### [n8n](https://github.com/n8n-io/n8n)
- 🔄 Fix user ignore filter for message_changed events [#23894](https://github.com/n8n-io/n8n/pull/23894)
- 🔄 Reset recurrence rules when schedule changes [#23840](https://github.com/n8n-io/n8n/pull/23840)

### [ventyd](https://github.com/daangn/ventyd)
- ✅ improve validation error messages [#46](https://github.com/daangn/ventyd/pull/46)
- ❌ verify second listener called in test code [#48](https://github.com/daangn/ventyd/pull/48)


<br>
<br>

<a href="https://github.com/devxb/gitanimals">
  <img src="https://render.gitanimals.org/farms/mag123c"/>
</a>

<br>
<br>


### 📕 Recent Posting ([tistory](https://mag1c.tistory.com))
- [AI 시대에 개발자로 살아남으려면 - 백엔드 개발자의 스타트업 수습 회고](https://mag1c.tistory.com/603)</br>
- [2026년 1월 회고 - 이직 후 적응하기, 러너스하이 2기, Claude Code Max 200$ 등..](https://mag1c.tistory.com/602)</br>
- [ccusage보다 1000배 빠른 AI 토큰 트래커 오픈소스를 만들기까지](https://mag1c.tistory.com/601)</br>
- [GoP(Garden of Practice) 회고 - 주니어 개발자 성장을 위한 커뮤니티!?](https://mag1c.tistory.com/600)</br>
- [나아가면서 되돌아보자.](https://mag1c.tistory.com/599)</br>
- [3년차 백엔드 개발자의 2025년 회고 (첫 이직)](https://mag1c.tistory.com/598)</br>
