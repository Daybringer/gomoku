'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">server documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-b234175324b42b105c56a3c0ea02f2cc"' : 'data-target="#xs-controllers-links-module-AppModule-b234175324b42b105c56a3c0ea02f2cc"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-b234175324b42b105c56a3c0ea02f2cc"' :
                                            'id="xs-controllers-links-module-AppModule-b234175324b42b105c56a3c0ea02f2cc"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-b234175324b42b105c56a3c0ea02f2cc"' : 'data-target="#xs-injectables-links-module-AppModule-b234175324b42b105c56a3c0ea02f2cc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-b234175324b42b105c56a3c0ea02f2cc"' :
                                        'id="xs-injectables-links-module-AppModule-b234175324b42b105c56a3c0ea02f2cc"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-ce57ef21781ebcd1e1ee229118e9b70b"' : 'data-target="#xs-controllers-links-module-AuthModule-ce57ef21781ebcd1e1ee229118e9b70b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-ce57ef21781ebcd1e1ee229118e9b70b"' :
                                            'id="xs-controllers-links-module-AuthModule-ce57ef21781ebcd1e1ee229118e9b70b"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-ce57ef21781ebcd1e1ee229118e9b70b"' : 'data-target="#xs-injectables-links-module-AuthModule-ce57ef21781ebcd1e1ee229118e9b70b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-ce57ef21781ebcd1e1ee229118e9b70b"' :
                                        'id="xs-injectables-links-module-AuthModule-ce57ef21781ebcd1e1ee229118e9b70b"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GoogleStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>GoogleStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TokensService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TokensService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GameModule.html" data-type="entity-link">GameModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-GameModule-444d2d33a9d33d57f5096c15b3cfbcd7"' : 'data-target="#xs-controllers-links-module-GameModule-444d2d33a9d33d57f5096c15b3cfbcd7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GameModule-444d2d33a9d33d57f5096c15b3cfbcd7"' :
                                            'id="xs-controllers-links-module-GameModule-444d2d33a9d33d57f5096c15b3cfbcd7"' }>
                                            <li class="link">
                                                <a href="controllers/GameController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GameController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-GameModule-444d2d33a9d33d57f5096c15b3cfbcd7"' : 'data-target="#xs-injectables-links-module-GameModule-444d2d33a9d33d57f5096c15b3cfbcd7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GameModule-444d2d33a9d33d57f5096c15b3cfbcd7"' :
                                        'id="xs-injectables-links-module-GameModule-444d2d33a9d33d57f5096c15b3cfbcd7"' }>
                                        <li class="link">
                                            <a href="injectables/GameService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>GameService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link">UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UsersModule-81d524ccdcb0f2bb92f44963af03acda"' : 'data-target="#xs-controllers-links-module-UsersModule-81d524ccdcb0f2bb92f44963af03acda"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-81d524ccdcb0f2bb92f44963af03acda"' :
                                            'id="xs-controllers-links-module-UsersModule-81d524ccdcb0f2bb92f44963af03acda"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-81d524ccdcb0f2bb92f44963af03acda"' : 'data-target="#xs-injectables-links-module-UsersModule-81d524ccdcb0f2bb92f44963af03acda"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-81d524ccdcb0f2bb92f44963af03acda"' :
                                        'id="xs-injectables-links-module-UsersModule-81d524ccdcb0f2bb92f44963af03acda"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/GameEntity.html" data-type="entity-link">GameEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/IconEntity.html" data-type="entity-link">IconEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/LogInDTO.html" data-type="entity-link">LogInDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/MatchConstraint.html" data-type="entity-link">MatchConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenDTO.html" data-type="entity-link">RefreshTokenDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenEntity.html" data-type="entity-link">RefreshTokenEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpDTO.html" data-type="entity-link">SignUpDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocialBladeSkinEntity.html" data-type="entity-link">SocialBladeSkinEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserEntity.html" data-type="entity-link">UserEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsernameExistsConstraint.html" data-type="entity-link">UsernameExistsConstraint</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link">JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link">JwtStrategy</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AuthenticationPayload.html" data-type="entity-link">AuthenticationPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatRecord.html" data-type="entity-link">ChatRecord</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/colors.html" data-type="entity-link">colors</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/colors-1.html" data-type="entity-link">colors</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GameInterface.html" data-type="entity-link">GameInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IconInterface.html" data-type="entity-link">IconInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/message.html" data-type="entity-link">message</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RefreshTokenInterface.html" data-type="entity-link">RefreshTokenInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RefreshTokenPayload.html" data-type="entity-link">RefreshTokenPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResponseObject.html" data-type="entity-link">ResponseObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SocialBladeSkinInterface.html" data-type="entity-link">SocialBladeSkinInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserInterface.html" data-type="entity-link">UserInterface</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});