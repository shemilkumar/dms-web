// import { TestBed } from "@angular/core/testing"
// import { ProbeplusModule } from "./probeplus.module"
// import { HttpClient } from "@angular/common/http";
// import { TranslateHttpLoader } from "@ngx-translate/http-loader";
// import { TranslateLoader, TranslateModule } from "@ngx-translate/core";

// export function HttpLoaderFactory(http: HttpClient) {
//     return new TranslateHttpLoader(http);
// }
// describe('ProbeplusModule' , ()=> {
//     beforeEach(()=>{
//         TestBed.configureTestingModule({
//             imports: [ProbeplusModule,
//                 TranslateModule.forRoot({
//                     loader: {
//                         provide: TranslateLoader,
//                         useFactory: HttpLoaderFactory,
//                         deps: [HttpClient]
//                     }
//                 }),
//             ],
//         })
//     })

//     it('initializes',()=> {
//         const module = TestBed.inject(ProbeplusModule);
//         expect(module).toBeTruthy();
//     })
// })