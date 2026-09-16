<template>
    <div class="login-page">
        <div class="split-container">
            <div class="visual-side"
                :style="{ backgroundImage: `linear-gradient(rgba(2, 13, 7, 0.5), rgba(2, 13, 7, 0.88)), url('/login_backdrop_1779051950394.png')` }">
                <div class="visual-content">
                    <h2 class="visual-title">{{ t('auth.visualTitle') }}</h2>
                    <p class="visual-desc">{{ t('auth.visualDesc') }}</p>
                </div>
            </div>

            <div class="form-side">
                <div class="form-box">
                    <div class="form-top-row">
                        <router-link to="/" class="back-home">{{ t('auth.backToSite') }}</router-link>
                        <LanguageSwitcher variant="compact" />
                    </div>

                    <header class="form-header">
                        <span class="agency-tag">{{ t('auth.agencyTag') }}</span>
                        <h2>{{ isLoginMode ? t('auth.signInTitle') : t('auth.registerTitle') }}</h2>
                        <p>{{ isLoginMode ? t('auth.signInSubtitle') : t('auth.registerSubtitle') }}</p>
                    </header>

                    <form @submit.prevent="handleSubmit" class="portal-form">
                        <div class="form-group" v-if="!isLoginMode">
                            <label for="reg-name">{{ t('auth.fullName') }}</label>
                            <input id="reg-name" v-model="fullName" type="text" required />
                        </div>

                        <div class="form-group" v-if="!isLoginMode">
                            <label for="reg-company">{{ t('auth.company') }}</label>
                            <input id="reg-company" v-model="company" type="text" required
                                :placeholder="t('auth.companyPlaceholder')" />
                        </div>

                        <div class="form-group" v-if="!isLoginMode">
                            <label for="reg-phone">{{ t('auth.phone') }}</label>
                            <input id="reg-phone" v-model="phone" type="tel" required
                                :placeholder="t('auth.phonePlaceholder')" />
                            <span v-if="phoneError" class="input-error">{{ phoneError }}</span>
                        </div>

                        <div class="form-group">
                            <label for="portal-email">{{ t('auth.email') }}</label>
                            <input id="portal-email" v-model="email" type="email" required />
                            <span v-if="emailError" class="input-error">{{ emailError }}</span>
                        </div>

                        <div class="form-group">
                            <label for="portal-pass">{{ t('auth.password') }}</label>
                            <div class="input-wrap">
                                <input id="portal-pass" v-model="password" :type="showPassword ? 'text' : 'password'"
                                    required />
                                <button type="button" class="toggle-pass" @click="showPassword = !showPassword">
                                    {{ showPassword ? t('auth.hide') : t('auth.show') }}
                                </button>
                            </div>
                            <span v-if="!isLoginMode" class="input-hint">{{ t('auth.passwordHint') }}</span>
                            <span v-if="passwordError" class="input-error">{{ passwordError }}</span>
                        </div>

                        <div v-if="alertMessage" class="portal-alert" :class="alertType">
                            {{ alertMessage }}
                        </div>

                        <button type="submit" class="submit-btn" :disabled="isLoading">
                            {{ isLoading ? t('auth.pleaseWait') : (isLoginMode ? t('auth.signInTitle') : t('auth.createAccount')) }}
                        </button>
                    </form>

                    <footer class="box-footer">
                        <p>
                            {{ isLoginMode ? t('auth.noAccount') : t('auth.hasAccount') }}
                            <a href="#"
                                @click.prevent="toggleMode">{{ isLoginMode ? t('auth.createAccount') : t('auth.signInTitle') }}</a>
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {
        ref,
        watch
    } from 'vue'
    import {
        useRouter
    } from 'vue-router'
    import {
        useI18n
    } from 'vue-i18n'
    import {
        useAuth
    } from '../composables/useAuth'
    import {
        isStrongPassword
    } from '../utils/password'
    //import LanguageSwitcher from '../components/LanguageSwitcher.vue'

    const router = useRouter()
    const {
        t
    } = useI18n()
    const {
        loginUser,
        registerUser
    } = useAuth()

    const isLoginMode = ref(true)
    const fullName = ref('')
    const company = ref('')
    const phone = ref('')
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const isLoading = ref(false)
    const emailError = ref('')
    const phoneError = ref('')
    const passwordError = ref('')
    const alertMessage = ref('')
    const alertType = ref('')


    const toggleMode = () => {
        isLoginMode.value = !isLoginMode.value
        alertMessage.value = ''
        emailError.value = ''
        phoneError.value = ''
        passwordError.value = ''
        password.value = ''
        phone.value = ''
    }



    watch(email, (value) => {
        if (value && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value)) {
            emailError.value = 'Invalid email format'
        } else {
            emailError.value = ''
        }
    })

    watch(phone, (value) => {
        if (!isLoginMode.value && value && value.replace(/\D/g, '').length < 9) {
            phoneError.value = 'Enter a valid phone number'
        } else {
            phoneError.value = ''
        }
    })

    watch(password, (value) => {
        if (!isLoginMode.value && value && !isStrongPassword(value)) {
            passwordError.value = t('auth.passwordHint')
        } else {
            passwordError.value = ''
        }
    })

    const handleSubmit = async () => {
        alertMessage.value = ''
        isLoading.value = true

        if (isLoginMode.value) {
            const result = await loginUser(email.value, password.value)
            isLoading.value = false
            if (result.success) {
                if (result.user?.role === 'admin') {
                    router.push('/admin')
                } else if (result.user?.role === 'operator') {
                    router.push('/operator')
                } else {
                    router.push('/dashboard')
                }
            } else {
                alertType.value = 'error'
                alertMessage.value = result.error || 'Login failed'
            }
        } else {
            if (!isStrongPassword(password.value)) {
                passwordError.value = t('auth.passwordHint')
                isLoading.value = false
                return
            }
            const result = await registerUser({
                name: fullName.value,
                company: company.value,
                phone: phone.value,
                email: email.value,
                password: password.value
            })
            isLoading.value = false
            if (result.success) {
                router.push('/dashboard')
            } else {
                alertType.value = 'error'
                alertMessage.value = result.error || 'Registration failed'
            }
        }
    }
</script>

<style scoped>
    .login-page {
        min-height: 100vh;
        background-color: #020d07;
        display: flex;
        font-family: 'Outfit', sans-serif;
        color: var(--text-main);
    }

    .split-container {
        display: grid;
        grid-template-columns: 1.1fr 1fr;
        width: 100%;
    }

    .visual-side {
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: flex-end;
        padding: 5rem;
        color: var(--white);
    }

    .visual-content {
        max-width: 580px;
    }

    .visual-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: clamp(2rem, 3.8vw, 3rem);
        font-weight: 900;
        color: #ffffff;
        line-height: 1.1;
        margin-bottom: 1.5rem;
    }

    .visual-desc {
        font-size: 1.05rem;
        line-height: 1.7;
        color: rgba(240, 253, 244, 0.7);
    }

    .form-side {
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4rem;
    }

    .form-box {
        width: 100%;
        max-width: 460px;
    }

    .form-top-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .back-home {
        color: var(--text-muted);
        font-size: 0.9rem;
        font-weight: 600;
        text-decoration: none;
    }

    .back-home:hover {
        color: #16a34a;
    }

    .form-header {
        margin-bottom: 2rem;
    }

    .agency-tag {
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        color: #16a34a;
        letter-spacing: 0.1em;
        margin-bottom: 10px;
        display: inline-block;
    }

    .form-header h2 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2rem;
        font-weight: 800;
        margin: 0 0 0.5rem;
    }

    .form-header p {
        font-size: 0.95rem;
        color: var(--text-muted);
    }

    .portal-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .form-group label {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--text-muted);
    }

    .form-group input,
    .input-wrap input {
        width: 100%;
        padding: 14px 16px;
        border-radius: 10px;
        background: var(--light-2);
        border: 1px solid rgba(0, 0, 0, 0.06);
        font-family: inherit;
        font-size: 0.95rem;
    }

    .form-group input:focus,
    .input-wrap input:focus {
        outline: none;
        border-color: #22c55e;
        background: #fff;
    }

    .input-wrap {
        position: relative;
    }

    .toggle-pass {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 0.82rem;
        font-weight: 600;
    }

    .input-hint,
    .input-error {
        font-size: 0.8rem;
    }

    .input-error {
        color: #ef4444;
        font-weight: 600;
    }

    .portal-alert {
        padding: 12px 14px;
        border-radius: 10px;
        font-size: 0.85rem;
        font-weight: 600;
    }

    .portal-alert.error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #b91c1c;
    }

    .portal-alert.success {
        background: #ecfdf5;
        border: 1px solid #bbf7d0;
        color: #166534;
    }

    .submit-btn {
        background: #22c55e;
        color: #052e16;
        border: none;
        font-size: 1rem;
        font-weight: 800;
        padding: 14px;
        border-radius: 10px;
        cursor: pointer;
    }

    .submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .box-footer {
        margin-top: 1.5rem;
        text-align: center;
        font-size: 0.9rem;
        color: var(--text-muted);
    }

    .box-footer a {
        font-weight: 700;
        color: #16a34a;
        text-decoration: none;
    }

    @media (max-width: 992px) {
        .split-container {
            grid-template-columns: 1fr;
        }

        .visual-side {
            display: none;
        }

        .form-side {
            padding: 5rem 1.5rem;
            min-height: 100vh;
        }
    }
</style>
