Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'investments/index'
      get 'investments/create'
      get 'investments/destroy'
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :tasks, defaults: {format: :json}
  devise_for :users, controllers: {registrations: "registrations"}

  get 'mortgages', to: 'home#mortgages'

  root to: 'home#index'

  namespace :banker do
    resources :mortgages
  end
  namespace :investor do
    resources :investments
    resources :mortgages
  end

  namespace :api do
    namespace :v1 do
      resources :mortgages
      resources :investments
    end
  end
end
